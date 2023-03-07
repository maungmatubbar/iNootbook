const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");
const { json } = require("express");

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
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          error: "Sorry this user already exists.",
        });
      }
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      return res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      console.log(error.message);
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
