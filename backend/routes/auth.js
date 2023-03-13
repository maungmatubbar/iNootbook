const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");
const { json } = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Mongisagoodboy";
router.post(
  "/create",
  [
    body("name", "Enter a valid name").isLength(5),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      console.log(user);
      if (user) {
        return res.status(400).json({
          error: "Sorry this user already exists.",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json(authToken);
      // return res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).send("Some error occured.");
    }
    // .then((user) => res.json(user))
    // .catch((error) =>
    //   res.json({
    //     errors: error.keyValue,
    //   })
    // );
  }
);
module.exports = router;
