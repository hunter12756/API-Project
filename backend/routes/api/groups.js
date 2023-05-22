// backend/routes/api/users.js
const express = require('express');
const { requireAuth } = require("../../utils/auth");
const { Op } = require('sequelize');
const { User, Group, Membership, GroupImage, Venue , Event,Attendance,EventImage} = require('../../db/models');
const router = express.Router();
//get all members of a group specified byu its id
router.get('/:groupId/members', async (req, res) => {
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
    //if cohost
    const cohost = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: groupId,
            status: 'co-host'
        }
    });


    const users = await User.findAll({
        attributes: ['id', 'firstName', 'lastName']
    });
    for(let i = 0; i < users.length; i++) {
        const member = await Membership.findOne({
            where: {
                groupId: group.id,
                userId: users[i].id
            }
        });

        const status =  member?.toJSON().status
        if(status) {
            users[i] = users[i].toJSON();
            users[i].Membership = { status }
        } else {
            users.splice(i, 1); // Remove element at index i
        i--;
        }
    }

    const noCo = users.filter(cur => {
        return cur.Membership.status !== 'pending'
    })

    if (!cohost && (group.organizerId !== req.user.id)) {
        return res.json({ "Members": noCo })
    }
    let payload = users.filter(user => user)
    return res.json({ "Members": payload })

})

//venues by groupId
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

//event by groupId
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
        where: {
            groupId:groupId
        }
    });

    for(let i = 0; i<events.length;i++) {
        const cur = events[i].toJSON();
        cur.numAttending = await Attendance.count({
            where: {
                eventId: cur.id
            }
        });
        const previewImage = await EventImage.findOne({
            where: {
                eventId: cur.id,
                preview:true
            }
        });

        if(previewImage) {
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

    res.json({"Events":events})
})
//current userId get group
//this works because there is an association where the userId is the same as the
//organizerId in the groups model
router.get('/current', requireAuth, async (req, res) => {
    const groups = await Group.findAll({
        attributes: ['id', 'organizerId', 'name', 'about', 'type', 'private', 'city',
            'state', 'createdAt', 'updatedAt'],
        where: {
            organizerId: req.user.id
        }
    });

    const memGs = await Membership.findAll({
        attributes: ['id', 'userId', 'groupId'],
        where: {
            userId: req.user.id
        },
        include: {
            model: Group
        }
    });

    if (memGs.length) {
        for (let mem of memGs) {
            groups.push(mem.Group)
        }
    }
    for (let i = 0; i<groups.length;i++) {
        groups = groups.toJSON();
        let id = groups[i].id;
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
            groups[i].previewImage = prev.url;

        } else {
            groups[i].previewImage = null;
        }
        groups[i].numMembers = membersCount;
    }
    return res.json({ "Groups": groups })
})
//get by id
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

//get all groups
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
//edit group by id
router.put("/:groupId", requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const {groupId} = req.params;

    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })
    if(!group) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"})
    }

    if (req.user.id !== group.organizerId) {
        res.status(403);
        return res.json({'message': 'Forbidden'})
    }
    const errors = {};
    if (name.length > 60) errors.name = "Name must be 60 characters or less";
    if (about.length < 50) errors.about = "About must be 50 characters or more";
    if (type !== "Online" && type !== "In Person") errors.type = "Type must be 'Online' or 'In Person'";
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
//add new group
router.post("/", requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const organizer = req.user.id;

    const errors = {};
    if (name.length > 60) errors.name = "Name must be 60 characters or less";
    if (about.length < 50) errors.about = "About must be 50 characters or more";
    if (type !== "Online" && type !== "In Person") errors.type = "Type must be 'Online' or 'In Person'";
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
    if(group.organizerId === req.user.id){
        res.status(400);
            return res.json({ "message": 'User is already a member of the group'});
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
//deletes
router.delete("/:groupId/membership", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const groupData = await Group.findOne({
        where: {
            id: groupId
        }
    });

    if (!groupData) {
        res.status(404);
        return res.json({"message": "Resource not found"});
    }

    const memberData = await User.findOne({
        where: {
            id: memberId
        }
    });

    if (!memberData) {
        res.status(400);
        return res.json({
            "message": "Validation Error",
            "errors": {
              "memberId": "Resource not found"
            }
        });
    }
    if (groupData.organizerId !== req.user.id && memberId !== req.user.id) {
        res.status(403);
        return res.json({"message": "Access Denied"});
    }

    const membershipData = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: groupId
        }
    });

    if (!membershipData) {
        res.status(404);
        return res.json({"message": "Resource not found"});
    }

    await Membership.destroy({
        where: {
            id: membershipData.id
        }
    });

    return res.json({"message": "Resource deleted successfully"});
});

router.delete("/:groupId",requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const selectedGroup = await Group.findOne({
        where: {
            id: groupId
        }
    });

    if (!selectedGroup) {
        res.status(404);
        return res.json({"message": "Resource not found"});
    }

    if (selectedGroup.organizerId !== req.user.id) {
        res.status(403);
        return res.json({"message": "Access Denied"});
    }

    await Group.destroy({
        where: {
            id: groupId
        }
    });

    return res.json({"message": "Resource deleted successfully"});
});

router.use((err, req, res, next) => {
    return res.json(err.errors);
});


module.exports = router;
