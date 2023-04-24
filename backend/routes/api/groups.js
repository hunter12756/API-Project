// backend/routes/api/users.js
const express = require('express');
const { requireAuth } = require("../../utils/auth");
const {Op} = require('sequelize');
const { User,Group,Membership,GroupImage } = require('../../db/models');
const router = express.Router();


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
            attributes: ['id','firstName','lastName']
        }
    ],
    });
    if(!group) {
        res.status(404);
        return res.json({"message":"Group couldn't be found"})
    }

    const membersCount = await Membership.count({
        where: {
            groupId:groupId
        }
    })

    group.dataValues.numMembers = membersCount;

    return res.json(group)
})

//get all groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll({
        attributes: ['id', 'organizerId', 'name', 'about', 'type', 'private', 'city',
            'state', 'createdAt', 'updatedAt']
    });

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
        if(prev){
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
    })

    if (!group) {
        res.status(404);
        return res.json({ "message": "Group couldn't be found" })
    }
    const curUserMember = await Membership.findOne({
        where: {
            groupId: groupId,
            userId: req.user.id
        }
    })

    if (curUserMember) {
        if (curUserMember.status === 'pending') {
            res.status(400);
            return res.json({ "message": "Membership has already been requested" })
        }
        if (curUserMember.status === 'co-host') {
            res.status(400);
            return res.json({ "message": "User is already a member of the group" })
        }

    }
    const newMembership = await Membership.create({
        userId: req.user.id,
        groupId: groupId,
        status: 'pending'
    })

    return res.json({
        "memberId": newMembership.id,
        "status": "pending"
    });
})
module.exports = router;
