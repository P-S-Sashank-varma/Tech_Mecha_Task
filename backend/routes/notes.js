const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const {
  createNote,
  getAllNotes,
  getNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

// All note routes require authentication
router.use(protect);

// Create a new note
router.post('/', createNote);

// Get all notes for logged-in user
router.get('/', getAllNotes);

// Get a single note by ID
router.get('/:id', getNote);

// Update a note
router.put('/:id', updateNote);

// Delete a note
router.delete('/:id', deleteNote);

module.exports = router;
