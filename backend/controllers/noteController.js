const Note = require('../models/Note');

// Create Note
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, tags, isPinned } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and content',
      });
    }

    // Create note with user ID
    const note = await Note.create({
      title,
      content,
      user: req.user.id,
      category: category || 'other',
      tags: tags || [],
      isPinned: isPinned || false,
    });

    // Populate user information
    await note.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating note',
    });
  }
};

// Get All Notes for Logged-in User
exports.getAllNotes = async (req, res) => {
  try {
    const { category, isPinned, tags } = req.query;

    // Build filter object
    const filter = { user: req.user.id };

    if (category) {
      filter.category = category;
    }

    if (isPinned === 'true') {
      filter.isPinned = true;
    } else if (isPinned === 'false') {
      filter.isPinned = false;
    }

    if (tags) {
      // Convert comma-separated tags string to array
      const tagArray = typeof tags === 'string' ? tags.split(',') : tags;
      filter.tags = { $in: tagArray };
    }

    // Fetch notes
    const notes = await Note.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching notes',
    });
  }
};

// Get Single Note by ID
exports.getNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Find note
    const note = await Note.findById(id).populate('user', 'name email');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // Check if note belongs to logged-in user
    if (note.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this note',
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching note',
    });
  }
};

// Update Note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags, isPinned } = req.body;

    // Find note
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // Check if note belongs to logged-in user
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this note',
      });
    }

    // Update fields
    if (title) note.title = title;
    if (content) note.content = content;
    if (category) note.category = category;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    // Save updated note
    await note.save();

    // Populate user information
    await note.populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note,
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating note',
    });
  }
};

// Delete Note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Find note
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // Check if note belongs to logged-in user
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this note',
      });
    }

    // Delete note
    await Note.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting note',
    });
  }
};
