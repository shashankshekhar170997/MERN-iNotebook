const express = require("express");
const router = express.Router();
const fetchUser = require("../Middleware/FetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get all the notes : GET "/api/notes/fetchallnotes". login require.
// fetchUser is a middleware.
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});
// ROUTE 2: Add a new notes : POST "/api/notes/addnote". login require.
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("description", "Descritpion must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // if there are errors, return Bad request and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }
  }
);
// ROUTE 3: Update an user notes : PUT "/api/notes/updatenote". login require.
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    //   Create a newNote object to put the updated values
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
    //   Find the note to be updated and update it.
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});
// ROUTE 4: Delete an user notes : DELETE "/api/notes/deletenote". login require.
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  // find the note to be delete and delete it.
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(400).send("Note Found");
    }

    // Allow deletion only if user owns this Note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});
module.exports = router;
