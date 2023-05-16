//delete an event  by eventid
const express = require('express');
const { Event, Group, Venue, Attendance, EventImage, Membership, User } = require('../../db/models');
const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();
router.get("/:eventId/attendees", async (req, res) => {
    const { eventId } = req.params;

    const event = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group
        }
    });

    // Uncomment the following line to enable logging
    // console.log("event", event);

    if (!event) {
        res.status(404);
        return res.json({"message": "Event not found"});
    }

    const attendees = await Attendance.findAll({
        where: {
            eventId: eventId
        },
        include: {
            model: User
        }
    });

    // Uncomment the following line to enable logging
    // console.log("attendees", attendees);

    const userMemb = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: event.Group.id,
            status: "co-host"
        }
    });

    const userAttendReformat = attendees.map(attendance => {
        return {
            id: attendance.User.id,
            firstName: attendance.User.firstName,
            lastName: attendance.User.lastName,
            Attendance: {
                status: attendance.status
            }
        };
    });

    const nonAuthResult = userAttendReformat.filter(user => {
        return user.Attendance.status !== "pending";
    });

    if (event.organizerId !== req.user.id && !userMemb) {
        return res.json({"Guest Attendees": nonAuthResult});
    }

    return res.json({"All Attendees": userAttendReformat});
});

//create new attendance
router.post("/:eventId/attendance", requireAuth, async (req, res) => {
    const { eventId } = req.params;
    const event = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group,
            attributes: ["id", "organizerId"]
        }
    });

    if (!event) {
        res.status(404);
        return res.json({"message": "Event not found"});
    }

    const membershipAuth = await Membership.findOne({
        where: {
            groupId: event.Group.id,
            userId: req.user.id,
            status: {
                [Op.or]: ["co-host", "member"]
            }
        }
    });

    if (!membershipAuth) {
        res.status(403);
        return res.json({"message": "Forbidden"});
    }

    const userAttendance = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: req.user.id
        }
    });

    if (userAttendance) {
        if (userAttendance.status === "pending") {
            res.status(400);
            return res.json({"message": "Attendance request already submitted"});
        }

        if (userAttendance.status === "attending" || userAttendance.status === "waitlist") {
            res.status(400);
            return res.json({"message": "User is already an attendee of the group"});
        }
    }

    const newAttendance = await Attendance.create({
        userId: req.user.id,
        eventId: eventId,
        status: "pending"
    });

    return res.json({
        "userId": newAttendance.userId,
        "status": newAttendance.status
    });
});

//create newimage
router.post('/:eventId/images',requireAuth,async (req,res)=> {
    const { eventId } = req.params;
    const { url, preview } = req.body;
    const event = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group
        }
    })
    if (!event) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"})
    }
    const cohosts= await Membership.findAll({
        where: {
            userId: req.user.id,
            groupId: event.Group.id,
            status: 'co-host'
        }
    })
    const curAttending = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: req.user.id,
            status: 'attending'
        }
    })

    if (event.Group.organizerId !== req.user.id && !cohosts.length && !curAttending) {
        res.status(403);
        return res.json({"message": "Forbidden"})
    }

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

})
//get event id
router.get('/:eventId', async (req,res)=> {
    const {eventId} = req.params;
    const event = await Event.findOne({
        where: {
            id: eventId
        },
        attributes: ["id", "groupId", "venueId", "name", "description", "type", "capacity", "price", "startDate", "endDate"],
        include: [{
            model: Group,
            attributes: ["id", "name", "private", "city", "state"]
        },
        {
            model: Venue,
            attributes: ["id", "address", "city", "state", "lat", "lng"]
        },
        {
            model: EventImage,
            attributes: ["id", "url", "preview"]
        }]
    })

    if(!event) {
        res.status(404);
        res.json({"message":"Event couldn't be found"})
    }

    const attenCount = await Attendance.count({
        where: {
            eventId:eventId
        }
    })

    event.dataValues.numAttending = attenCount;
    return res.json(event)
})
//edit event
router.put('/:eventId',requireAuth,async (req,res)=> {
    const {eventId} =req.params;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const event = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group,
            attributes: ["id", "organizerId"]
        }
    })

    if (!event) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"})
    }

    const cohosts = await Membership.findAll({
        where: {
            groupId: event.Group.id,
            userId: req.user.id,
            status: "co-host"
        }
    })
    if(event.Group.organizerId !== req.user.id && !cohosts.length){
        res.status(403);
        return res.json({"message": "Only the User or organizer may delete an Attendance"})
    }

    let newTime = new Date();
    //turn dates from string to Date()
    let startD = new Date(startDate);
    let endD = new Date(endDate);

    const errors={};
    if (!venueId) errors.venueId = "Venue does not exist";
    if (!name || name.length < 5) errors.name = "Name must be at least 5 characters";
    if (type !== "Online" && type !== "In Person") errors.type = "Type must be Online or In Person";
    if (!Number.isInteger(capacity)) errors.capacity = "Capacity must be an integer";
    if (!price || price < 0 || isNaN(price)) errors.price = "Price is invalid";
    if (!description) errors.description = "Description is required";
    if (startD <= newTime) errors.startDate = "Start date must be in the future";
    if (endD < startD) errors.endDate = "End date is less than start date";

    if (Object.keys(errors).length ) {
        res.status(400)
        return res.json({"message": "Bad Request",errors})
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

router.put('/:eventId/attendance',requireAuth,async (req,res)=>{
    const { eventId } = req.params;
    const { userId, status } = req.body;
    const event = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group,
            attributes: ["id", "organizerId"]
        }
    })
///bassic errors
    if(status === 'pending') {
        res.status(400);
        return res.json({"message": "Cannot change an attendance status to pending"})
    }
    if (!event) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"})
    }

    const cohost = await Membership.findOne({
        where: {
            groupId: event.Group.id,
            userId: req.user.id,
            status: 'co-host'
        }
    })

    if(event.Group.organizerId !== req.user.id && !cohost.length) {
        res.status(403);
        return res.json({"message":"forbidden"})
    }

    const curUser = await User.findByPk({userId})
    if(!curUser) {
        res.status(400);
        return res.json({
            "message": "Validation Error",
            "errors": {
                "memberId": "User couldn't be found"
            }
        })
    }

    const attenToChange = await Attendance.findOne({
        where: {
            eventId:eventId,
            userId:userId
        }
    })
    if (!attenToChange) {
        res.status(404);
        return res.json({"message": "Attendance between the user and the event does not exist"})
    }

    attenToChange.update({
        status
    });

    return res.json({
        "id": attenToChange.id,
        "eventId": eventId,
        "userId": req.user.id,
        "status": attenToChange.status
    })
})
//delete attendance from event
router.delete('/:eventId/attendance',requireAuth,async (req,res)=>{
    const {eventId} = req.params;
    const {userId} = req.body;
    const eventToDelete = await Event.findOne({
        where: {
            id: eventId
        },
        include : {
            model: Group,
            attributes: ['id','organizerId']
        }
    });
    const curUser = await User.findOne({
        where: {
            id: userId
        }
    })
    const attendingUser = await Attendance.findOne({
        where: {
            userId: userId,
            eventId:eventId
        }
    })

    //checks if not auth'd
    if(eventToDelete.Group.organizerId !== req.user.id && user.id !== req.user.id){
        res.status(403);
        return res.json({"message": "Only the User or organizer may delete an Attendance"})
    }
    if(!attendingUser) {
        res.status(404);
        return res.json({"message": "Attendance does not exist for this User"})
    }
    if(!curUser) {
        res.status(400);
        return res.json({"message": "Validation Error",
            "errors": {
              "memberId": "User couldn't be found"
            }
        })
    }
    if(!eventToDelete) {
        res.status(404)
        return res.json({"message": "Event couldn't be found"})
    }

    await Attendance.destroy({
        where: {
            id: attendingUser.id
        }
    })

    return res.json({"message":"Successfully deleted attendance from event"})
})
//delete for event by eventId
router.delete("/:eventId", requireAuth,async (req, res) => {
    const { eventId } = req.params;
    const selectedEvent = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group,
            attributes: ["id", "organizerId"]
        }
    });

    if (!selectedEvent) {
        res.status(404);
        return res.json({"message": "Selected event not found"});
    }
    const selectedMemberships = await Membership.findAll({
        where: {
            groupId: selectedEvent.Group.id,
            userId: req.user.id,
            status: "co-host"
        }
    });

    if (selectedEvent.Group.organizerId !== req.user.id && !selectedMemberships.length ) {
        res.status(403);
        return res.json({"result": "error", "message": "Access Denied"});
    }

    await Event.destroy({
        where: {
            id: eventId
        }
    });

    return res.json({"result": "success", "message": "Event deleted successfully"});
});


router.get('/', async (req, res) => {
    let { page, size, name, type, startDate } = req.query;

    if (!page || isNaN(page)) page = 1;
    if (!size || isNaN(size)) size = 20;

    const errors = {};
    if (page < 1) {
        errors.page = "Page must be greater than or equal to 1";
    }
    if (size < 1) {
        errors.size = "Size must be greater than or equal to 1";
    }
    if (name && typeof name !== "string") errors.name = "Name must be a string";
    if (type && type !== "Online" && type !== "In Person") errors.type = "Type must be 'Online' or 'In Person'";
    if (startDate && isNaN(Date.parse(startDate))) errors.startDate = "Start date must be a valid datetime";

    if (page > 10) page = 10;
    if (size > 20) size = 20;

    page = parseInt(page);
    size = parseInt(size);

    if (Object.keys(errors).length) {
        res.status(400)
        return res.json({"message": "Bad Request",errors})
    }
    //where object
    const where = {};
    if (name) where.name = name;
    if (type) where.type = type;
    if (startDate) where.startDate = startDate;

    const events = await Event.findAll({
        attributes: ["id", "groupId", "venueId", "name", "type", "startDate", "endDate"],
        where,
        limit: size,
        offset: size * (page - 1),
        include: [{
            model: Group,
            attributes: ["id", "name", "city", "state"]
        },
        {
            model: Venue,
            attributes: ["id", "city", "state"]
        }]
    })

    for (let cur of events) {
        const attenCount = await Attendance.count({
            where: {
                eventId: cur.id
            }
        })
        const prev = await EventImage.findOne({
            where: {
                eventId: cur.id,
                preview: true
            }
        })
        cur.dataValues.numAttending = attenCount;
        if (prev) {
            cur.dataValues.previewImage = prev.url;
        } else {
            cur.dataValues.previewImage = null;
        }
    }
    return res.json({ "Events": events });
})


router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
