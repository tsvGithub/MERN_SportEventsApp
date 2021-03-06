const { json } = require("express");
const Registration = require("../models/Registration");
const jwt = require("jsonwebtoken");

module.exports = {
  approval(req, res) {
    jwt.verify(req.token, process.env.SUPER_MARIO, async (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        //registartion_id is from URL params
        const { registration_id } = req.params;
        try {
          //await for booking/registration
          const registration = await Registration.findById(registration_id);
          if (registration) {
            console.log(authData.user);
            console.log(registration);
            //booking approved: change the object to true
            registration.approved = true;
            //save changed object
            await registration.save();
            return res.json(registration);
          }
        } catch (error) {
          return res.status(400).json(error);
        }
      }
    });
  },
};
