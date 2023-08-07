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
        //this is broken
        const group = await Group.findAll({
            where: {
                organizerId: user.id
            }
        });

        const venue = await Venue.findByPk(req.params.venueId)
        if(!venue){
            res.status(404)
            return res.json("Venue could not be found")
        }
        
        //this is broken
        const member = await Membership.findOne({
            where: {
                userId: user.id,
                groupId:venue.groupId
            }
        })
        if(!member){
            return res.json("Member couldn't be found")
        }
        //this if statement is not hitting correctly
        if (group[0].organizerId === user.id ||
            venue.groupId === group[0].id ||
            (member.status === 'co-host' && member.groupId === user.id)) {
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
            let venueObj = venue.toJSON();
            delete venueObj.updatedAt;
            res.json(venueObj);

        } else {
            res.status(403);
            // return res.json(`Current Group Organizer ID:${group[0].organizerId} UserID: ${user.id} Venue GroupId: ${venue.groupId} Current Group ID: ${group[0].id} Member Status: ${member.status} Member Group ID: ${member.groupId}`)
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
