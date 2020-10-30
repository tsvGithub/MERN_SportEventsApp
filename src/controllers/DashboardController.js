const Event = require("../models/Event");
const jwt = require("jsonwebtoken");

module.exports = {
  getEventById(req, res) {
    jwt.verify(req.token, process.env.SUPER_MARIO, async (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        //req.param() searches the URL path, body, and query string of the request (in that order) for the specified parameter. If no parameter value exists anywhere in the request with the given name, it returns undefined
        const { eventId } = req.params;
        try {
          const events = await Event.findById(eventId);

          if (events) {
            return res.json({ authData: authData, events: events });
            // return res.json(event);
          }
        } catch (error) {
          return res.status(400).json({
            message: "Event does not exist!",
          });
        }
      }
    });
  },

  getAllEvents(req, res) {
    // console.log("token ", req.token);
    jwt.verify(req.token, process.env.SUPER_MARIO, async (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        //req.param() searches the URL path, body, and query string of the request (in that order) for the specified parameter. If no parameter value exists anywhere in the request with the given name, it returns undefined
        const { sport } = req.params;
        //if is sport do Event.find(sport) or {} search for Event.find({}) all
        const query = sport ? { sport } : {};

        try {
          const events = await Event.find(query);
          if (events) {
            return res.json({ authData, events });
          }
        } catch (error) {
          return res.status(400).json({
            message: "No found any events",
          });
        }
      }
    });
  },

  getEventsByUserId(req, res) {
    debugger;
    jwt.verify(req.token, process.env.SUPER_MARIO, async (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        const { user_id } = req.headers;
        // console.log("DBCTRLLER: req.headers USER-ID", user_id);

        try {
          const events = await Event.find({ user: authData.user._id });
          // console.log("DBCTRLLER: user: authData.user_id", events);
          if (events) {
            return res.json({ authData, events });
            // return res.json(events);
          }
        } catch (error) {
          return res.status(400).json({
            message: `Can't find any events from user_id ${user_id}`,
          });
        }
      }
    });
  },
};
