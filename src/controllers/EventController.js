const Event = require("../models/Event");
const User = require("../models/User");

module.exports = {
  async createEvent(req, res) {
    //req.param() searches the URL path, body, and query string of the request (in that order) for the specified parameter. If no parameter value exists anywhere in the request with the given name, it returns undefined
    const { title, description, price, sport } = req.body;
    const { user_id } = req.headers;
    const { filename } = req.file;

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
      });
    }

    const event = await Event.create({
      title,
      description,
      price: parseFloat(price),
      sport,
      user: user_id,
      thumbnail: filename,
    });

    return res.json(event);
  },
  async deleteEvent(req, res) {
    //req.param() searches the URL path, body, and query string of the request (in that order) for the specified parameter. If no parameter value exists anywhere in the request with the given name, it returns undefined
    const { eventId } = req.params;
    try {
      await Event.findByIdAndDelete(eventId);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({
        message: "Cannot delete Event",
      });
    }
  },

  //=======================
  //moved to Dashboard Controller
  //   async getEventById(req, res) {
  //     const { eventId } = req.params;
  //     try {
  //       const event = await Event.findById(eventId);

  //       if (event) {
  //         return res.json(event);
  //       }
  //     } catch (error) {
  //       return res.status(400).json({
  //         message: "Event does not exist!",
  //       });
  //     }
  //   },
  //   async getAllEvents(req, res) {
  //     try {
  //       const events = await Event.find({});
  //       if (events) {
  //         return res.json(events);
  //       }
  //     } catch (error) {
  //       return res.status(400).json({
  //         message: "Not found any events",
  //       });
  //     }
  //   },
};
