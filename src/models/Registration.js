const mongoose = require("mongoose");

const RegistrationScheema = new mongoose.Schema({
  date: () => Date.now(),
  approved: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
});

module.exports = mongoose.model("Registration", RegistrationScheema);
