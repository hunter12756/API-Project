const express = require('express');
const {Op} = require('sequelize');
const { Event, Group, Membership, GroupImage ,Venue,Attendance,EventImage,User} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
    let imageId = req.params.imageId;
    const {user} = req;

    const image = await GroupImage.findByPk(imageId,{
       include:[{model:Group}]
    })
    const group = image.Group;

    if (!image) {
        res.status(404);
        return res.json({"message": "Group image couldn't be found"})
    }

    const memberships = await Membership.findOne({
        attributes:['status'],
        where: {
            groupId: group.id,
            userId: user.id,
        }
    })

    if (group.organizerId !== user.id || memberships?.status !== 'co-host') {
        res.status(403);
        return res.json({"message": "Forbidden"})
    }

    await image.destroy();
    return res.json({"message": "Successfully deleted"})
})


router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
