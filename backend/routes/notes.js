const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Note = require("../Models/Note");
const fatchuser = require("../middleware/fetchUser");
router.get("/fetch-all-notes", fatchuser, async (req, res) => {
  console.log("hello");
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});

//Create Note
router.post(
  "/add-note",
  fatchuser,
  [body("title", "The title is required").isLength(5), body("description", "The description is required").isLength(5)],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, description, tag } = req.body;
      const note = new Note({ title, description, tag, user: req.user.id });
      const noteRes = await note.save();
      res.json(noteRes);
    } catch (error) {
      console.log(error);
      res.status(400).send("Some error occured.");
    }
  }
);
module.exports = router;
