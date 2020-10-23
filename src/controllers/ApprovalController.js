const { json } = require("express");
const Registration = require("../models/Registration");

module.exports = {
  async approval(req, res) {
    //registartion_id is from URL params
    const { registration_id } = req.params;
    try {
      //await for booking/registration
      const registration = await Registration.findById(registration_id);
      //booking approved: change the object to true
      registration.approved = true;
      //save changed object
      await registration.save();
      return res.json(registration);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};
