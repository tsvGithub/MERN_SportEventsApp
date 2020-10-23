const Registration = require("../models/Registration");

module.exports = {
  async create(req, res) {
    //user is loggedIn, there's user_id in headers
    const { user_id } = req.headers;
    //eventId from URL params
    const { eventId } = req.params;
    const { date } = req.body;

    const registration = await Registration.create({
      user: user_id,
      event: eventId,
      date,
    });
    //remove password '-password"
    await registration.populate("event").populate("user", "-password").execPopulate();

    return res.json(registration);
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
