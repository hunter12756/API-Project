const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { Event, Group, Venue, Attendance, EventImage, GroupImage, Membership, User } = require('../../db/models');
const router = express.Router();

const validateEventSignup = [
    check("name")
        .exists({ checkFalsy: true })
        .isLength({ min: 5 })
        .withMessage("Name must be at least 5 characters"),
    check("type")
        .exists({ checkFalsy: true })
        .isIn(["In person", "Online"])
        .withMessage("Type must be Online or In person"),
    check("capacity")
        .exists({ checkFalsy: true })
        .isNumeric()
        .withMessage("Capacity must be an integer"),
    check("price")
        .exists({ checkFalsy: true })
        .isNumeric()
        .withMessage("Price is invalid"),
    check("description")
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    check("startDate")
        .exists({ checkFalsy: true })
        .custom((val) => {
            const todayDate = new Date();
            const startDate = new Date(val);
            if (startDate < todayDate) {
                throw new Error("Start date must be in the future");
            }
            return true;
        }),
    check("endDate")
        .exists({ checkFalsy: true })
        .custom((val, { req }) => {
            const endDate = new Date(val);
            const startDate = new Date(req.body.startDate);
            if (endDate < startDate) {
                throw new Error("End date is less than start date");
            }
            return true;
        }),
    handleValidationErrors,
];
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

    if (!event) {
        res.status(404);
        return res.json({ "message": "Event not found" });
    }

    const attendees = await Attendance.findAll({
        where: {
            eventId: eventId
        },
        include: {
            model: User
        }
    });

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
        return res.json({ "Guest Attendees": nonAuthResult });
    }

    return res.json({ "Attendees": userAttendReformat });
});

//create new attendance

router.post("/:eventId/attendance", requireAuth, async (req, res) => {
    const {user} = req


    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        res.status(404);
        return res.json({ "message": "Event not found" });
    }

    let member = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: event.groupId,
            status: ['co-host', 'member']
        }
    });

    if (!member) {
        res.status(403);
        return res.json({ "message": "Membership between the user and the event does not exist" });
    }

    const userAttendance = await Attendance.findOne({
        where: {
            eventId: req.params.eventId,
            userId: user.id
        }
    });

    if (userAttendance) {
        if (userAttendance.status === "pending") {
            res.status(400);
            return res.json({ "message": "Attendance request already submitted" });
        }

        if (userAttendance.status === "attending" ) {
            res.status(400);
            return res.json({ "message": "User is already an attendee of the group" });
        }
    }

    const newAttendance = await Attendance.create({
        userId: user.id,
        eventId: req.params.eventId,
        status: 'pending'
    });

    return res.json({
        userId: newAttendance.userId,
        status: newAttendance.status
    });
});

//create newimage

router.post('/:eventId/images', requireAuth, async (req, res) => {
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
        return res.json({ "message": "Event couldn't be found" })
    }
    const cohosts = await Membership.findAll({
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
        return res.json({ "message": "Forbidden" })
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
router.get('/:eventId', async (req, res) => {
    const { eventId } = req.params;
    const event = await Event.findOne({
        where: {
            id: eventId
        },
        attributes: ["id", "groupId", "venueId", "name", "description", "type", "capacity", "price", "startDate", "endDate"],

    })

    if (!event) {
        res.status(404);
        res.json({ "message": "Event couldn't be found" })
    }

    const payload = event.toJSON();
    const attenCount = await Attendance.count({
        where: {
            eventId: eventId
        }
    })
    payload.numAttending = attenCount
    payload.Group = await Group.findByPk(payload.groupId, {
        attributes: ['id', 'name', 'private', 'city', 'state','organizerId'],
        raw:true
    });


    payload.GroupImages = await GroupImage.findAll({
        where:{
            groupId:payload.Group.id
        },
        attributes:['id','url','preview'],
        raw:true
    });

    payload.Organizer = await User.findByPk(payload.Group.organizerId, {
        attributes: ['id', 'firstName', 'lastName'],
        raw:true
    })


    payload.Venue = await Venue.findByPk(payload.venueId, {
        attributes: ['id', 'address', 'city', 'state', 'lat', 'lng'],
        raw:true
    });
    payload.EventImages = await EventImage.findAll({
        where: {
            eventId: payload.id
        },
        attributes: ['id', 'url', 'preview'],
        raw:true
    });
    console.log("\nPayload ",payload, '\n')
  
    return res.json(payload)
})
//edit event

router.put('/:eventId', requireAuth, async (req, res) => {
    const { user } = req;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    let eventId = req.params.eventId;

    const event = await Event.findByPk(eventId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [{ model: Group }, { model: Venue }]
    })

    if (!event) {
        res.status(404);
        return res.json({ "message": "Event couldn't be found" })
    }
    const group = event.Group;
    const venue = event.Venue;

    if (!venue) {
        res.status(404);
        return res.json({ "message": "Venue couldn't be found" })
    }

    const member = await Membership.findOne({
        attributes: ['status'],
        where: {
            groupId: group.id,
            userId: user.id
        }
    })

    if (member?.status !== 'co-host' || group.organizerId !== user.id) {
        res.status(403);
        return res.json({ message: "Forbidden" })
    }

    //updating event with new info
    const updated = await event.update({
        venueId: venueId ?? event.venueId,
        name: name ?? event.name,
        type: type ?? event.type,
        capacity: capacity ?? event.capacity,
        price: price ?? event.price,
        description: description ?? event.description,
        startDate: startDate ?? event.startDate,
        endDate: endDate ?? event.endDate,
    })

    const eventObject = updated.toJSON();
    eventObject.id = event.id;
    eventObject.groupId = group.id;

    delete eventObject.Group;
    delete eventObject.Venue;
    delete eventObject.createdAt;
    delete eventObject.updatedAt;

    res.json(eventObject);

})
//delete for event by eventId

router.delete("/:eventId", requireAuth, async (req, res) => {
    const { user } = req;
    let eventId = req.params.eventId;

    const event = await Event.findByPk(eventId, {
        include: [{ model: Group }]
    })

    if (!event) {
        res.status(404);
        return res.json({ "message": "Event could not be found" });
    }

    const group = event.Group;

    const member = await Membership.findOne({
        attributes: ['status'],
        where: {
            groupId: group.id,
            userId: user.id
        }
    });

    if (member.status === 'co-host' || group.organizerId === user.id) {
        await event.destroy();
        return res.json({ result: "success", message: "Event deleted successfully" });
    } else {
        res.status(403);
        return res.json({ message: "Forbidden" })

    }

});
router.put('/:eventId/attendance', requireAuth, async (req, res) => {
    let eventId = req.params.eventId;
    const { user } = req
    const { userId, status } = req.body;

    const event = await Event.findByPk(eventId, {
        include: { model: Group }
    })
    const group = event.Group;

    const membership = await Membership.findOne({
        attributes: ['status'],
        where: {
            groupId: group.id,
            userId: user.id,
        }
    })

    if (membership?.status !== 'co-host' || group.organizerId !== user.id) {
        res.status(403);
        return res.json({ message: "Forbidden" })
    }
    if (status === 'pending') {
        res.status(400);
        return res.json({ message: "Cannot change an attendance status to pending" })
    }
    const attendance = await Attendance.findOne({
        where: {
            userId,
            eventId
        }
    })
    if (!attendance) {
        res.status(404);
        return res.json({ "message": "Attendance between the user and the event does not exist" })
    }

    const updated = await attendance.update({
        userId,
        status
    });

    const updatedObject = updated.toJSON();
    delete updatedObject.updatedAt;
    res.json({id:updatedObject.id ,eventId:updatedObject.eventId, userId:updatedObject.userId,status:updatedObject.status});
})
//delete attendance from event
router.delete('/:eventId/attendance', requireAuth, async (req, res) => {

    const { user } = req;
    const { userId} = req.body

    const event = await Event.findByPk(req.params.eventId, {
        include: [{ model: Group }]
    })
    if (!event) {
        res.status(404);
        return res.json({ message: "Event could not be found" })
    }
    const group = event.Group;

    const attendance = await Attendance.findOne({
        where: {
            eventId:req.params.eventId,
            userId:userId
        }
    })

    if (!attendance) {
        res.status(404);
        return res.json({message: "Attendance does not exist for this User" })
    }

    if (userId=== user.id || group.organizerId === user.id) {
        await attendance.destroy();

        return res.json({ "message": "Successfully deleted attendance from event" })
    } else {
        res.status(403);
        return res.json({ message: "Forbidden" })

    }


})


//working
//get rid of createdAt and updatedAt
router.get('/', async (req, res) => {
    const where = {};
    const { name, type, startDate } = req.query;

    //query fileters
    if (name) where.name = {
        [Op.like]: `%${name}%`
    };
    if (type) {
        where.type = type;
    }
    if (startDate) {
        where.startDate = {
            [Op.gt]: new Date(startDate)
        };
    }

    //pagination not working correctly
    const pagination = {};
    let { page, size } = req.query;

    if (!page) page = 1;
    if (!size) size = 20;
    page = parseInt(page);
    size = parseInt(size);

    if (page > 10) page = 10;

    if (size > 20) size = 20;
    if (size < 1) size = 1;

    const err = new Error('Bad Request');
    err.errors = {};
    let bool = false;

    //errors handling
    if (page < 1) {
        err.errors.page = "Page must be greater than or equal to 1";
        bool = true;
    }
    if (size < 1) {
        err.errors.size = "Size must be greater than or equal to 1";
        bool = true;
    }
    if (name && !isNaN(parseInt(name))) {
        err.errors.name = "Name must be a string";
        bool = true;
    }
    if (type && type !== 'Online' && type !== 'In person') {
        err.errors.type = "Type must be 'Online' or 'In person'";
        bool = true;
    }

    if (startDate && isNaN(Date.parse(startDate))) {
        err.errors.startDate = "Start date must be a valid datetime";
        bool = true;
    };

    if (bool) {
        return next(err);
    }

    pagination.limit = size;
    pagination.offset = size * (page - 1);
    //console.log(where);

    const events = await Event.findAll({
        where,
        ...pagination
    });

    //attending appending
    for (let i = 0; i < events.length; i++) {
        const curEvent = events[i].toJSON();

        curEvent.numAttending = await Attendance.count({
            where: {
                eventId: curEvent.id
            }
        });

        const previewImage = await EventImage.findOne({
            where: {
                eventId: curEvent.id,
                preview: true
            }
        });

        curEvent.previewImage = previewImage?.url ?? 'No preview image for event'

        curEvent.Group = await Group.findByPk(curEvent.groupId, {
            attributes: ['id', 'name', 'city', 'state']
        });

        curEvent.venue = await Venue.findByPk(curEvent.venueId, {
            attributes: ['id', 'city', 'state']
        });

        events[i] = curEvent;
    }

    res.json({ Events: events });
})


router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
