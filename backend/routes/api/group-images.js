const express = require('express');
const {Op} = require('sequelize');
const { Event, Group, Membership, GroupImage ,Venue,Attendance,EventImage,User} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const image = await GroupImage.findOne({
        where: {
            id: imageId
        },
        include: {
            model: Group,
            attributes: ["id", "organizerId"]
        }
    })

    if (!image) {
        res.status(404);
        return res.json({"message": "Group image couldn't be found"})
    }

    const memberships = await Membership.findAll({
        where: {
            groupId: image.Group.id,
            userId: req.user.id,
            status: "co-host"
        }
    })

    if (image.Group.organizerId !== req.user.id && memberships.length === 0) {
        res.status(403);
        return res.json({"message": "Forbidden"})
    }

    await GroupImage.destroy({
        where: {
            id: imageId
        }
    })
    return res.json({"message": "Successfully deleted"})
})


router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
