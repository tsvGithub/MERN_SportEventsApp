const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

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
        // return res.json(userResponse);

        //JWT.sign gets user object => it is the userResponse
        //second argument is string 'secret' from .env  where is super strong password
        //token is userResponse+secret
        //return user as token & user_id (not hashed!) fro FE
        return jwt.sign(
          {
            user: userResponse,
          },
          process.env.SUPER_MARIO,
          (err, token) => {
            return res.json({
              user: token,
              user_id: userResponse._id,
            });
          }
        );
      } else {
        return res.status(200).json({
          message: "Email or Password does not match!",
        });
      }
    } catch (error) {
      throw Error(`Error on Authentication a User ${error}`);
    }
  },
};
