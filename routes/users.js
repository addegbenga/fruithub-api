const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const {
  registerValidations,
  loginValidations,
} = require("../middleware/validations");

const User = require("../model/User");

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
//login routes
// @access   Public
router.post(
  "/login",

  async (req, res) => {
    const { error } = loginValidations(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };

      jwt.sign(payload, "secret", { expiresIn: "5 days" }, (err, token) => {
        if (err) throw err;
        res.json({ msg: "success", token: token, payload: payload });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//register route....
router.post(
  "/register",

  async (req, res) => {
    const { error } = registerValidations(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, "secret", { expiresIn: "5 days" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
