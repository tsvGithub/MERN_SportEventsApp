const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = {
  async createUser(req, res) {
    try {
      //   console.log(req.body);
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
        //returns all user data (names, email & PASSWORD)
        // return res.json(user);
        //returns user data WITHOUT PASSWORD
        return res.json({
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      }
      return res.status(400).json({
        message: "User already exist, do you want to login instead?",
      });
    } catch (error) {
      throw Error(`Error on registering new User: ${error}`);
    }
  },

  async getUserById(req, res) {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);
      return res.json(user);
    } catch (error) {
      return res.status(400).json({
        message: "User ID does not exist, do you want to register instead? ",
      });
    }
  },
};
