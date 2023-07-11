const express = require('express');
const { Event, Group, EventImage, Membership } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
    let imageId = req.params.imageId;
    const {user} = req;

    const image = await EventImage.findByPk(imageId);

    if (!image) {
        res.status(404);
        return res.json({"message": "Event image couldn't be found"})
    }

    const event = await Event.findByPk(image.eventId,{
        include:[{model:Group}]
    })
    const group = event.Group;

    const membership = await Membership.findOne({
        attributes:['status'],
        where: {
            groupId: group.id,
            userId: user.id,
        }
    })

    if (group.organizerId !== user.id || membership?.status !== 'co-host') {
        res.status(403);
        return res.json({"message": "Forbidden"})
    }

    await image.destroy()

    return res.json({"message": "Successfully deleted"})


})



router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
