// backend/routes/api/users.js
const express = require('express');
const { requireAuth } = require("../../utils/auth");
const { Op } = require('sequelize');
const { User, Group, Membership, GroupImage } = require('../../db/models');
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

    const members = await Membership.findAll({
        where: {
            groupId: groupId
        },
        include: {
            model: User
        }
    });

    const result = {
        id: members.User.id,
        firstName: members.User.firstName,
        lastName: members.User.lastName,
        Membership: {
            status: members.status
        }
    }

    const noCo = res.filter(cur => {
        return cur.Membership.status !== 'pending'
    })

    if (!cohost && (group.organizerId !== req.user.id)) {
        return res.json({ "Members": noCo })
    }
    return res.json({ "Members": result })

})

//venues by groupId
router.get('/:groupId/venues', requireAuth, async (req, res) => {
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
    const cohost = await Membership.findAll({
        where: {
            userId: req.user.id,
            groupId: groupId,
            status: 'co-host'
        }
    });
    if (!cohost && (group.organizerId !== req.user.id)) {
        res.status(403);
        return res.json({ "message": "forbidden" })
    }

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
        attributes: ["id", "groupId", "venueId",
            "name", "type", "startDate", "endDate"],
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            },
        ],
        where: {
            groupId:groupId
        }
    });

    for(cur of events) {
        const attenCount = await Attendance.count({
            where: {
                eventId: cur.id
            }
        });
        const img = await EventImage.findOne({
            where: {
                eventId: cur.id,
                preview:true
            }
        });
        cur.dataValues.numAttending =attenCount;
        if(img) {
            cur.dataValues.previewImage = img.url;
        } else {
            cur.dataValues.previewImage = null;
        }

    };

    return res.json({"Events":events})
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
})
//get by id
router.get('/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const group = await Group.findOne({
        where: {
            id: groupId
        },
        include: [{
            model: GroupImage,
            attributes: ['id', 'url', 'preview']
        },
        {
            model: Venue,
            attributes: ['id', 'groupId', 'address',
                'city', 'state', 'lat', 'lng']
        },
        {
            model: User,
            as: "Organizer",
            attributes: ['id', 'firstName', 'lastName']
        }
        ],
    });
    if (!group) {
        res.status(404);
        return res.json({ "message": "Group couldn't be found" });
    };
    const membersCount = await Membership.count({
        where: {
            groupId: groupId
        }
    });
    group.dataValues.numMembers = membersCount;

    return res.json(group)
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

//edit

module.exports = router;
