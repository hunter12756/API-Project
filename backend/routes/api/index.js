// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js');
const eventsRouter = require('./events.js');
const eventImagesRouter = require("./event-images.js");
const venuesRouter = require("./venues.js");
const groupImagesRouter = require("./group-images.js");

const { restoreUser } = require("../../utils/auth.js");
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);
router.use('/groups',groupsRouter);
router.use('/events',eventsRouter);
router.use("/event-images", eventImagesRouter);
router.use("/venues", venuesRouter);
router.use("/group-images", groupImagesRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});
//restores user
// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );
//require auth
// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );


//cookie test
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });
module.exports = router;
