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

    console.log(`eventId: ${eventId}`);
    const events = {}
    events.rows = await Event.findAll({
        attributes: ['id','groupId','venueId','name','type',
        ,'startDate','endDate',],
        includes: {}
    });
    events.numAttending= '';
    events.previewImage='';
    if(!events) {
        res.status(404);
        return res.json({"message":"Event couldn't be found"});
    }

    res.json(events);
})



//delete for event by eventId
router.delete('/:eventId',requireAuth,async (req,res)=> {
    const eventId = req.params.eventId;
    const {user} = req;
    const userId = user.id;

    console.log(`eventId: ${eventId}`);
    const curEvent = await Event.findByPk(eventId);

    if(!curEvent) {
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
