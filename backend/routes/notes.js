const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Note = require("../Models/Note");
const fatchuser = require("../middleware/fetchUser");
const fetchuser = require("../middleware/fetchUser");
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
//Update note
router.put("/update-note/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }
    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });
  } catch (error) {
    console.log(error);
    res.status(400).send("Some error occured.");
  }
});
//Delete Note
router.delete("/delete-note/:id", fetchuser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "Note has been deleted successfully.", note: note });
  } catch (error) {
    console.log(error);
    res.status(400).send("Some error occured.");
  }
});
module.exports = router;
