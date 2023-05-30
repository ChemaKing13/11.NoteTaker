const express = require('express'); 
const fs = require('fs'); 
const path = require('path');
const router = express.Router(); //this create an instance of the express router, allow us to define routes and their handlers

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
//first sets the up the POST route
router.post('/notes', (req, res) => {
  fs.readFile(path.join(__dirname, '../db/db.json'), 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes from the database' });
      return;
    }

    //htsi parses the content of the db.json into a js object
    const notes = JSON.parse(data);

    const currentDate = new Date(); 
    const newNoteID = currentDate.getTime().toString();  //this generates a unique by using the current timestamp as the ID

    //this creates a new note objetc
    const newNote = {
      id: newNoteID,
      title: req.body.title,
      text: req.body.text,
    };

    // Add the new note to the array of notes
    notes.push(newNote);

    // Write the updated notes array back to the db.json file
    fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save the new note' });
        return;
      }

      res.status(201).json(newNote);
    });
  });
});

//Delete a note 
//id is a route parameter that represents the ID of the note to be deleted 
router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;  //here we extract the id from the note that will be deleted 

  fs.readFile(path.join(__dirname, '../db/db.json'), 'utf-8', (err, data) => {
    if (err) {
      console.error(err); 
      res.status(500).json({ error: 'Failed to read notes from the database '}); 
      return; 
    }

    let notes = JSON.parse(data); 

    //find the index of the note with the given id
    const noteIndex = notes.findIndex((note) => note.id === noteId); 

    //if the note is not found the code sends a 404 erorr indicating that the note wasnt found
    if (noteIndex === -1) {
      res.status(404).json({ erorr: 'Note not found'}); 
      return; 
    }

    //else the note its removed from the array using notes.splice()
    //remove the note from the array 
    notes.splice(noteIndex, 1); 

    //Write the updated notes array to the db.json file 
    fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err); 
        res.status(500).json({ error: 'Failed to delete note'}); 
        return; 
      }
      res.status(204).send(); 
    }); 
  });
}); 



//exports the router module so that it can be used in other files 
module.exports = router;

