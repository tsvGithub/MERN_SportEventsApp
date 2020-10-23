const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = {
  async storeAuth(req, res) {
    try {
      // (req.body) a request with a parseable body (e.g. JSON, URL-encoded, or XML) has body parameters equal to its parsed value
      const { email, password } = req.body;
      //1. check if login fields are filled
      if (!email || !password) {
        return res.status(200).json({
          message: "Required field missing!",
        });
      }
      //2 if (1) OK, check if user exists (by unique email)
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(200).json({
          message: "User not found!",
        });
      }
      //3 if User exists (2) check password
      if (user && (await bcrypt.compare(password, user.password))) {
        const userResponse = {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        };
        return res.json(userResponse);
      } else {
        return res.status(200).jason({
          message: "Email or Password does not match!",
        });
      }
    } catch (error) {
      throw Error(`Error on Authentication a User ${error}`);
    }
  },
};
