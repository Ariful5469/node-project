const express = require('express');
const Message = require('/models/Message');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Create a message (for users)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newMessage = new Message({
      name,
      email,
      message,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save message', error: err });
  }
});

// Get all messages (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Check if the user is an admin (this could be a role check depending on your implementation)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err });
  }
});

// Update a message (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { message },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json(updatedMessage);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update message', error: err });
  }
});

// Delete a message (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const deletedMessage = await Message.findByIdAndDelete(req.params.id);

    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete message', error: err });
  }
});

module.exports = router;
