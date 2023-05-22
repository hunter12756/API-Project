//delete an event  by eventid
const express = require('express');
const { Event, Group, Venue, Attendance, EventImage, Membership, User } = require('../../db/models');
const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//Get all Events
router.get('/',async (req,res)=> {
    const eventId = req.params.eventId;
    const {user} = req;
    const userId = user.id;

    const newImg = await EventImage.create({
        eventId: eventId,
        url: url,
        preview: preview
    })
    return res.json({
        "id": newImg.id,
        "url": newImg.url,
        "preview": newImg.preview
    });
    events.numAttending= '';
    events.previewImage='';
    if(!events) {
        res.status(404);
        return res.json({"message":"Event couldn't be found"});
    }

    //updating event with new info
    event.update({
        venueId,
        name,
        type,
        capacity,
        description,
        startDate,
        endDate
    })

    res.json({
        "id": event.id,
        "groupId": event.Group.id,
        "venueId": event.venueId,
        "name": event.name,
        "type": event.type,
        "capacity": event.capacity,
        "price": event.price,
        "description": event.description,
        "startDate": event.startDate,
        "endDate": event.endDate
    })
})


    await Attendance.destroy({
        where: {
            id: attendingUser.id
        }
    })

//delete for event by eventId
router.delete('/:eventId',requireAuth,async (req,res)=> {
    const eventId = req.params.eventId;
    const {user} = req;
    const userId = user.id;

    if (!selectedEvent) {
        res.status(404);
        return res.json({"message":"Event couldn't be found"});
    }

    const groupId =curEvent.groupId;

    const userValidate = await validateUserOrgCohost(userId,groupId);
    if(typeof userValidate==='object') {
        res.status(404)
        return res.json({"message":"Current User must be the organizer of the group or a member of the group with a status of co-host"})
    }
    await curEvent.destroy();
    res.json({"message":"Successfully deleted"});
})

module.exports = router;
