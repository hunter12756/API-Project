const express = require('express');
const {Venue, Group, Membership} = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.put("/:venueId", requireAuth, async (req, res) => {
    const { venueId } = req.params;
    const { address, city, state, lat, lng } = req.body;


    const venue = await Venue.findOne({
        where: {
            id: venueId
        },
        include: {
            model: Group,
            attributes: ["id", "organizerId"]
        }
    })

    if (!venue) {
        res.status(404);
        return res.json({"message": "Venue couldn't be found"})
    }
    //find all members that have the status of co host
    const membershipCo = await Membership.findAll({
        where: {
            groupId: venue.Group.id,
            userId: req.user.id,
            status: "co-host"
        }
    })

    //takes care of forbidden error IF the organizerId is NOT the same as the userID
    if (venue.Group.organizerId !== req.user.id && membershipCo.length === 0) {
        res.status(403);
        return res.json({"message": "Forbidden"})
    }

    const errors = {};
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (typeof lat !== "number" || lat < -90 || lat > 90) errors.lat = "Latitude is not valid";
    if (typeof lng !== "number" || lng < -180 || lng > 180) errors.lng = "Longitude is not valid";

    if (Object.keys(errors).length ) {
        res.status(400)
        return res.json({"message": "Bad Request",errors});
    }

    venue.update({
        address: address,
        city: city,
        state: state,
        lat: lat,
        lng: lng
    })

    return res.json({
        "id": venue.id,
        "groupId": venue.groupId,
        "address": venue.address,
        "city": venue.city,
        "state": venue.state,
        "lat": venue.lat,
        "lng": venue.lng
    })

});

router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
