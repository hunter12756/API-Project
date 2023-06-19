const express = require('express');
const { Venue, Group, Membership } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.put("/:venueId", requireAuth, async (req, res) => {
    const { user } = req;
    const { venueId } = req.params;

    if (user) {
        const group = await Group.findAll({
            where: {
                organizerId: venueId
            }
        });

        const venue = await Venue.findOne({
            where: {
                id: venueId
            }
        })


        const member = await Membership.findByPk(user.id)
        if (group[0].toJSON().organizerId === user.id &&
            venue.toJSON().groupId === group[0].toJSON().id ||
            (member.toJSON().status == 'co-host' && member.toJSON().groupId === user.id)) {
            const { address, city, state, lat, lng } = req.body;
            const venue = await Venue.findOne({
                attributes: {
                    exclude: ['updatedAt', 'createdAt']
                },
                where: {
                    id: venueId
                }
            })
            if (!venue) {
                res.status(404);
                return res.json({ "message": "Venue couldn't be found" })
            }
            const errors = {};
            if (!address) errors.address = "Street address is required";
            if (!city) errors.city = "City is required";
            if (!state) errors.state = "State is required";
            if (typeof lat !== "number" || lat < -90 || lat > 90) errors.lat = "Latitude is not valid";
            if (typeof lng !== "number" || lng < -180 || lng > 180) errors.lng = "Longitude is not valid";

            if (Object.keys(errors).length) {
                res.status(400)
                return res.json({ "message": "Bad Request", errors });
            }


            if (address) venue.address = address
            if (city) venue.city = city
            if (state) venue.state = state
            if (lat) venue.lat = lat
            if (lng) venue.lng = lng

            await venue.save();


            return res.json(venue);
        } else {
                res.status(403);
                return res.json({ "message": "Forbidden" })
            }

        }
    });
router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
