const Registration = require("../models/Registration");
const jwt = require("jsonwebtoken");

module.exports = {
  create(req, res) {
    jwt.verify(req.token, process.env.SUPER_MARIO, async (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        //user is loggedIn, there's user_id in headers
        const user_id = authData.user._id;
        //eventId from URL params
        const { eventId } = req.params;
        // const { date } = req.body;

        const registration = await Registration.create({
          user: user_id,
          event: eventId,
          // date,
        });
        //remove password '-password"
        await registration.populate("event").populate("user", "-password").execPopulate();

        // console.log(registration.event.user);

        const ownerSocket = req.connectUsers[registration.event.user];

        if (ownerSocket) {
          req.io.to(ownerSocket).emit("registration_request", registration);
        }

        return res.json(registration);
      }
    });
  },
  async getRegistration(req, res) {
    //registration_id  from URL params
    const { registration_id } = req.params;
    try {
      const registration = await Registration.findById(registration_id);
      await registration.populate("user", "-password").populate("event").execPopulate();

      return res.json(registration);
    } catch (error) {
      return res.status(400).json({
        message: "Registration not found",
      });
    }
  },
};
