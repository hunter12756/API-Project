const express = require('express');
const { Event, Group, EventImage, Membership } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const image = await EventImage.findOne({
        where: {
            id: imageId
        },
        include: {
            model: Event
        }
    })

    if (!image) {
        res.status(404);
        return res.json({"message": "Event image couldn't be found"})
    }



    const group = await Group.findOne({
        where: {
            id: image.Event.groupId
        }
    })

    const memberships = await Membership.findAll({
        where: {
            groupId: group.id,
            userId: req.user.id,
            status: "co-host"
        }
    })

    if (group.organizerId !== req.user.id && memberships.length === 0) {
        res.status(403);
        return res.json({"message": "Forbidden"})
    }

    await EventImage.destroy({
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
