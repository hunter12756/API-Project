const express = require('express');
const { Venue, Group, Membership } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();
const validateVenueSignup = [
    check("address")
      .exists({ checkFalsy: true })
      .withMessage("Street address is required"),
    check("city").exists({ checkFalsy: true }).withMessage("City is required"),
    check("state").exists({ checkFalsy: true }).withMessage("State is required"),
    check("lat")
      .exists({ checkFalsy: true })
      .isNumeric()
      .withMessage("Latitude is not valid"),
    check("lng")
      .exists({ checkFalsy: true })
      .isNumeric()
      .withMessage("Longitude is not valid"),
    handleValidationErrors,
  ];
router.put("/:venueId", requireAuth,validateVenueSignup, async (req, res, next) => {
    const { user } = req;

    if (user) {
        const group = await Group.findAll({
            where: {
                organizerId: user.id
            }
        });

        const venue = await Venue.findByPk(req.params.venueId)
        console.log(group[0].toJSON())
        const member = await Membership.findByPk(user.id)
        if (group[0].toJSON().organizerId === user.id &&
            venue.toJSON().groupId === group[0].toJSON().id ||
            (member.toJSON().status === 'co-host' && member.toJSON().groupId === user.id)) {
            const { address, city, state, lat, lng } = req.body;
            let venue = await Venue.findByPk(req.params.venueId, {
                attributes: {
                    exclude: ['updatedAt', 'createdAt']
                }
            });
            if (!venue) {
                res.status(404);
                return res.json({ message: "Venue couldn't be found" })
            }

            if (address) {
                venue.address = address
            }
            if (city) {
                venue.city = city
            }
            if (state) {
                venue.state = state
            }
            if (lat) {
                venue.lat = lat
            }
            if (lng) {
                venue.lng = lng
            }

            await venue.save();
            
            res.json(venue);
            return('hi')
        } else {
            res.status(403);
            return res.json({ message: "Forbidden" })
        }

    } else {
        res.status(401);
        return res.json({message: "Authentication required"})
    }
});
router.use((err, req, res, next) => {
    return res.json(err.errors)
})

module.exports = router;
