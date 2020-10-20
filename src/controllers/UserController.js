const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = {
  async store(req, res) {
    try {
      console.log(req.body);
      const { firstName, lastName, email, password } = req.body;

      const existenUser = await User.findOne({ email });

      if (!existenUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
        });
        return res.json(user);
      }
      return res.status(400).json({
        message: "User already exist, do you want to login instead?",
      });
    } catch (error) {
      throw Error(`Error on registering new User: ${error}`);
    }
  },
};
