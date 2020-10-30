const Event = require("../models/Event");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = {
  createEvent(req, res) {
    jwt.verify(req.token, process.env.SUPER_MARIO, async (err, authData) => {
      if (err) {
        res.statusCode(401);
      } else {
        //req.param() searches the URL path, body, and query string of the request (in that order) for the specified parameter. If no parameter value exists anywhere in the request with the given name, it returns undefined
        const { title, description, price, sport, date } = req.body;
        // const { user_id } = req.headers;
        const { filename } = req.file;

        const user = await User.findById(authData.user._id);

        if (!user) {
          return res.status(400).json({
            message: "User does not exist!",
          });
        }

        try {
          const event = await Event.create({
            title,
            description,
            sport,
            price: parseFloat(price),
            user: authData.user._id,
            thumbnail: filename,
            date,
          });

          return res.json(event);
        } catch (error) {
          return res.status(400).json({ message: error });
        }
      }
    });
  },
  deleteEvent(req, res) {
    jwt.verify(req.token, process.env.SUPER_MARIO, async (err) => {
      if (err) {
        res.statusCode(401);
      } else {
        const { eventId } = req.params;
        try {
          await Event.findByIdAndDelete(eventId);
          return res.status(204).send();
        } catch (error) {
          return res.status(400).json({
            message: "Cannot delete Event",
          });
        }
      }
    });
    //req.param() searches the URL path, body, and query string of the request (in that order) for the specified parameter. If no parameter value exists anywhere in the request with the given name, it returns undefined
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
