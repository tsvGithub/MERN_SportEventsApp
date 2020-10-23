const Event = require("../models/Event");

module.exports = {
  async getEventById(req, res) {
    //req.param() searches the URL path, body, and query string of the request (in that order) for the specified parameter. If no parameter value exists anywhere in the request with the given name, it returns undefined
    const { eventId } = req.params;
    try {
      const event = await Event.findById(eventId);

      if (event) {
        return res.json(event);
      }
    } catch (error) {
      return res.status(400).json({
        message: "Event does not exist!",
      });
    }
  },

  async getAllEvents(req, res) {
    //req.param() searches the URL path, body, and query string of the request (in that order) for the specified parameter. If no parameter value exists anywhere in the request with the given name, it returns undefined
    const { sport } = req.params;
    //if is sport do Event.find(sport) or {} search for Event.find({}) all
    const query = { sport } || {};

    try {
      const events = await Event.find(query);
      if (events) {
        return res.json(events);
      }
    } catch (error) {
      return res.status(400).json({
        message: "No found any events",
      });
    }
  },
};
