// backend/routes/api/users.js
const express = require('express');
const { requireAuth } = require("../../utils/auth");
const { Op } = require('sequelize');
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { User, Group, Membership, GroupImage, Venue, Event, Attendance, EventImage } = require('../../db/models');
const router = express.Router();

const validateVenueSignup = [
    check("address")
      .exists({ checkFalsy: true })
      .withMessage("Street address is required"),
    check("city").exists({ checkFalsy: true }).withMessage("City is required"),
    check("state").exists({ checkFalsy: true }).withMessage("State is required"),
    check("lat")
      .exists({ checkFalsy: true })
      .isNumeric()
      .withMessage("Latitude is not valid"),
    check("lng")
      .exists({ checkFalsy: true })
      .isNumeric()
      .withMessage("Longitude is not valid"),
    handleValidationErrors,
  ];
//get all groups
//works
router.get('/', async (req, res) => {
    const groups = await Group.findAll({
        attributes: ['id', 'organizerId', 'name', 'about', 'type', 'private', 'city',
            'state', 'createdAt', 'updatedAt'],
    })
    for (let group of groups) {
        let id = group.id;
        const membersCount = await Membership.count({
            where: {
                groupId: id
            }
        })
        const prev = await GroupImage.findOne({
            where: {
                groupId: {
                    [Op.eq]: id
                },
                preview: {
                    [Op.eq]: true
                }
            }
        });
        if (prev) {
            group.dataValues.previewImage = prev.url;

        } else {
            group.dataValues.previewImage = null;
        }
        group.dataValues.numMembers = membersCount;
    }
    return res.json({ "Groups": groups })
});

//current userId get group
router.get('/current', requireAuth, async (req, res) => {
    let {user} = req;
    const memberships = await Membership.findAll({
        where: {
            userId: user.id,

        }
    });

    let groupArray = [];
    for(const membership of memberships) {
        const {groupId} = membership;
        const group = await Group.findOne({
            include: {
                model:GroupImage,
                where: {
                    preview:true
                },
                attributes:['url'],
                required:false
            },
            where: {
                id:groupId
            }
        });
        //turn into POJO because we are adding our own new custom attributes
        groupChange = group.toJSON();
        const numMembers = await Membership.count({
            where: {
                groupId: group.id,
            }
        });

        groupChange.previewImage = null;
        groupChange.numMembers = numMembers;

        for(const img of groupChange.GroupImages){
            groupChange.previewImage = img.url;
        }
        delete groupChange.GroupImages;
        groupArray.push(groupChange)
    }
    res.json({Groups:groupArray})
});

//get by id
//works
router.get('/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const group = await Group.findOne({
        where: {
            id: groupId
        },
        include: [
            {
                model: GroupImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: Venue,
                attributes: ['id', 'groupId', 'address',
                    'city', 'state', 'lat', 'lng']
            },

        ],
    });
    if (!group) {
        res.status(404);
        res.json({ "message": "Group couldn't be found" });
    };
    const payload = group.toJSON();
    const membersCount = await Membership.count({
        where: {
            groupId: groupId
        }
    });
    payload.numMembers = membersCount;
    payload.Organizer = await User.findByPk(payload.organizerId, {
        attributes: ['id', 'firstName', 'lastName']
    })

    res.json(payload);
})
//add new group
//WORKS
router.post("/", requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const organizer = req.user.id;

    const errors = {};
    if (name.length > 60) errors.name = "Name must be 60 characters or less";
    if (about.length < 50) errors.about = "About must be 50 characters or more";
    if (type !== "Online" && type !== "In person") errors.type = "Type must be 'Online' or 'In person";
    if (private !== true && private !== false) errors.private = "Private must be a boolean";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";

    if (Object.keys(errors).length) {
        res.status(400);
        return res.json({
            "message": "Bad Request",
            "errors": errors
        });
    }

    const newGroup = await Group.create({
        organizerId: organizer,
        name: name,
        about: about,
        type: type,
        private: private,
        city: city,
        state: state
    });

    res.status(201);
    return res.json(newGroup);
});

//edit group by id
//WORKS
router.put("/:groupId", requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const { groupId } = req.params;

    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })
    if (!group) {
        res.status(404);
        return res.json({ "message": "Group couldn't be found" })
    }

    if (req.user.id !== group.organizerId) {
        res.status(403);
        return res.json({ 'message': 'Forbidden' })
    }
    const errors = {};
    if (name.length > 60) errors.name = "Name must be 60 characters or less";
    if (about.length < 50) errors.about = "About must be 50 characters or more";
    if (type !== "Online" && type !== "In person") errors.type = "Type must be 'Online' or 'In person";
    if (private !== true && private !== false) errors.private = "Private must be a boolean";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";

    if (Object.keys(errors).length) {
        res.status(400);
        return res.json({
            "message": "Bad Request",
            "errors": errors
        });
    }
    group.update({
        name: name,
        about: about,
        type: type,
        private: private,
        city: city,
        state: state
    })
    return res.json(group);
});

//adds an image to a group based on the groups id
router.post("/:groupId/images", requireAuth, async (req, res, next) => {
   const {user} = req;
   const {url,preview} = req.body
    let groupId = req.params.groupId;
   const group = await Group.findByPk(req.params.groupId);
   if(!group){
    res.status(404);
    return res.json({message:"Group couldn'tbe found"})
   }
   if(group.organizerId !== user.id){
    res.status(401);
    return res.json({message:"Authentication Required"})
   }
   if(group.organizerId === user.id){
    const newGroupImg = await GroupImage.create({
        groupId,
        url,
        preview
    })
    return res.json({id:newGroupImg.id,url,preview})
   }


})

//deletes specified group
router.delete("/:groupId", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const selectedGroup = await Group.findOne({
        where: {
            id: groupId
        }
    });

    if (!selectedGroup) {
        res.status(404);
        return res.json({ "message": "Resource not found" });
    }

    if (selectedGroup.organizerId !== req.user.id) {
        res.status(403);
        return res.json({ "message": "Access Denied" });
    }

    await Group.destroy({
        where: {
            id: groupId
        }
    });

    return res.json({ "message": "Resource deleted successfully" });
});

//venues by groupId
//WORKS check lat and lon datatypes to make sure, they are diff on live than local
router.get('/:groupId/venues', requireAuth, async (req, res) => {
    const { groupId } = req.params;

    const venues = await Venue.findAll({
        where: {
            groupId: groupId
        },
        attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"]

    });

    return res.json({ "Venues": venues })
})

//create new venue
router.post('/:groupId/venues', validateVenueSignup,requireAuth, async (req, res) => {
    const {user} = req;
    let groupId = req.params.groupId;
    const {address,city,state,lat,lng} = req.body;

    const group = await Group.findByPk(groupId);
    if(!group) {
        res.status(404);
    return res.json({message:"Group couldn'tbe found"})
    }

    const member = await Membership.findOne({
        where: {
            groupId,
            userId:user.id
        }
    })

    if(member.toJSON().status !=='co-host' || group.toJSON().organizerId !== user.id) {
        res.status(403)
        return res.json({message:"Forbidden"})
    }

    const venue = await Venue.create({
        groupId,
        address,
        city,
        state,
        lat,
        lng
    })
    const venueObject = venue.toJSON();
    delete venueObject.createdAt;
    delete venueObject.updatedAt;
    res.json(venueObject)
})

//request membership to the group

router.post("/:groupId/membership", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const group = await Group.findOne({
        where: {
            id: groupId
        }
    });
    if (!group) {
        res.status(404);
        return res.json({ "message": "Group couldn't be found" })
    }
    const curUserMember = await Membership.findOne({
        where: {
            groupId: groupId,
            userId: req.user.id
        }
    });
    if (group.organizerId === req.user.id) {
        res.status(400);
        return res.json({ "message": 'User is already a member of the group' });
    }
    if (curUserMember) {
        if (curUserMember.status === 'pending') {
            res.status(400);
            return res.json({ 'message': 'Membership has already been requested' });
        }
        if (curUserMember.status === 'co-host') {
            res.status(400);
            return res.json({ 'message': 'User is already a member of the group' });
        }
    };
    const newMembership = await Membership.create({
        userId: req.user.id,
        groupId: groupId,
        status: 'pending'
    });
    return res.json({
        "memberId": newMembership.id,
        "status": "pending"
    });
})

//change membership
router.put("/:groupId/membership", requireAuth, async (req, res) => {
    const {user} = req;
    let groupId = req.params.groupId;
    const {memberId,status} = req.body

    const curUser = await User.findByPk(memberId);
    const member = await Membership.findOne({
        where: {
            userId: memberId,
            groupId
        }
    })

    if(!curUser) {
        res.status(400);
        return res.json({message:"User could not be found"})
    }
    if(status === 'pending') {
        res.status(400);
        return res.json({message:"Cannot change membership status to pending"})

    }

    const group = await Group.findByPk(groupId);
    if(!group ) {
        res.status(404);
        return res.json({message:"Group could not be found"})
    }

    if(!member) {
        res.status(404);
        return res.json({message:"Membership between the user and the group does not exist"})
    }

    if( (group.organizerId !== user.id || member?.status !== 'co-host') || (group.organizerId !== user.id && status === 'co-host' )){
        res.status(403);
        return res.json({message:"Forbidden"})
    }

    const updated = await membership.update({
        memberId,
        status
    })

    const updateObject = updated.toJSON();
    delete updateObject.updatedAt;
    delete updateObject.createdAt;
    res.json({id: updateObject.id,groupId,memberId,status})
})
//deletes membership

router.delete("/:groupId/membership", requireAuth, async (req, res) => {
    let groupId = req.params.groupId;
    const { memberId } = req.body;
    const {user} = req;

    const group = await Group.findByPk(groupId);

    if (!group) {
        res.status(404);
        return res.json({ "message": "Group could not be found" });
    }

    const curUser = await User.findByPk(memberId);

    if (!curUser) {
        res.status(400);
        return res.json({message:"User could not be found"})
    }

    const membership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId
        }
    });

    if (!membership) {
        res.status(404);
        return res.json({ message: "Membership could not be found" });
    }
    if (memberId!==user.id || group.organizerId !== user.id) {
        res.status(403);
        return res.json({message: "Forbidden" });
    }

    await membership.destroy();

    return res.json({ "message": "Successfully deleted membership from group" });
});

/*        EVENTS SECTION        */
//event by groupId
//works
router.get('/:groupId/events', async (req, res) => {
    const { groupId } = req.params;

    const group = await Group.findOne({
        where: {
            id: groupId
        }
    });
    if (!group) {
        res.status(404)
        return res.json({ "message": "Group couldn't be found" });
    }

    const events = await Event.findAll({
        attributes: {
            exclude: ['description', 'capacity', 'price', 'updatedAt', 'createdAt']
        },
        where: {
            groupId: groupId
        }
    });

    for (let i = 0; i < events.length; i++) {
        const cur = events[i].toJSON();
        cur.numAttending = await Attendance.count({
            where: {
                eventId: cur.id
            }
        });
        const previewImage = await EventImage.findOne({
            where: {
                eventId: cur.id,
                preview: true
            }
        });

        if (previewImage) {
            cur.previewImage = previewImage.url;
        } else {
            cur.previewImage = null;
        }
        cur.Group = await Group.findByPk(cur.groupId, {
            attributes: ['id', 'name', 'city', 'state']
        });
        cur.Venue = await Venue.findByPk(cur.venueId, {
            attributes: ['id', 'city', 'state']
        });
        events[i] = cur;

    };

    res.json({ "Events": events })
})
//create an Event
router.post('/:groupId/events', requireAuth, async (req, res, next) => {
    const {user} = req;
    let groupId = req.params.groupId;
    const {venueId,name,type,capacity,price,description,startDate,endDate} = req.body;

    const group = await Group.findByPk(groupId);
    if(!group) {
        res.status(404);
    return res.json({message:"Group couldn'tbe found"})
    }

    const member = await Membership.findOne({
        where: {
            groupId,
            userId:user.id
        }
    })

    if(member.toJSON().status !=='co-host' || group.toJSON().organizerId !== user.id) {
        res.status(403)
        return res.json({message:"Forbidden"})
    }

    const event = await Event.create({
        groupId,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    })
    const eventObject = event.toJSON();
    delete eventObject.createdAt;
    delete eventObject.updatedAt;
    res.json(eventObject)
})
//get all members of a group specified by its id
router.get('/:groupId/members', async (req, res) => {
    const { groupId } = req.params;
    const { user } = req
    const group = await Group.findOne({
        where: {
            id: groupId
        }
    });
    if (!group) {
        res.status(404)
        return res.json({ "message": "Group couldn't be found" });
    }

    const members = await Membership.findAll({
        where: {
            groupId: req.params.groupId
        },
        attributes: ['status'],
        include: {
            model: User
        }
    });


    if (group.toJSON().organizerId === user.id) {
        let arr = [];
        let Members = [];
        members.forEach((member) => {
            arr.push(member.toJSON())
        });

        for (let i = 0; i < arr.length; i++) {
            let currentMember = arr[i];
            Members.push({
                id: currentMember.User.id,
                firstName: currentMember.User.firstName,
                lastName: currentMember.User.lastName,
                Membership: {
                    status: currentMember.status
                }
            })
        }

        return res.json({ Members })
    } else {
        let arr = [];
        let Members = [];
        members.forEach((member) => {
            arr.push(member.toJSON())
        });

        for (let i = 0; i < arr.length; i++) {
            let currentMember = arr[i];
            if (currentMember.status !== 'pending') {
                Members.push({
                    id: currentMember.User.id,
                    firstName: currentMember.User.firstName,
                    lastName: currentMember.User.lastName,
                    Membership: {
                        status: currentMember.status
                    }
                })
            }
        }
        return res.json({Members})
    }

})

router.use((err, req, res, next) => {
    return res.json(err.errors);
});


module.exports = router;
