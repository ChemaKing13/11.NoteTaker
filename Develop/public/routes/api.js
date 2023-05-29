const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Get all notes
router.get('/notes', (req, res) => {
  // Read the db.json file
  fs.readFile(path.join(__dirname, '../db/db.json'), 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ errors: 'Failed to read notes from the database' });
      return;
    }

    // Parse the data as JSON
    const notes = JSON.parse(data);

    res.json(notes);
  });
});

// Create a new note
router.post('/notes', (req, res) => {
  fs.readFile(path.join(__dirname, './db/db.json'), 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes from the database' });
      return;
    }

    const notes = JSON.parse(data);

    const newNoteID = Math.random().toString(36).substr(2, 9);

    const newNote = {
      id: newNoteID,
      title: req.body.title,
      text: req.body.text,
    };

    // Add the new note to the array of notes
    notes.push(newNote);

    // Write the updated notes array back to the db.json file
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save the new note' });
        return;
      }

      res.status(201).json(newNote);
    });
  });
});

module.exports = router;

