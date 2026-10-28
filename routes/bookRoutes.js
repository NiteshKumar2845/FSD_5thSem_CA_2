const express = require('express');
const mongoose = require('mongoose');
const Book = require('../Model/bookModel');

const router = express.Router();

router.post('/', async (req, res) => {
  const { title, author, category } = req.body || {};
  if (!title || !author || !category) {
    return res.status(400).json({ message: 'Title, author, and category are required' });
  }

  try {
    const newBook = await Book.create({ title, author, category });
    return res.status(201).json(newBook);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create book' });
  }
});

router.get('/', async (req, res) => {
  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 10;
  if (page < 1 || limit < 1) {
    return res.status(400).json({ message: 'Page and limit must be positive integers' });
  }

  try {
    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(limit);
    return res.json(books);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve books' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }

  const body = req.body || {};
  const updates = {};
  for (const field of ['title', 'author', 'category', 'available']) {
    if (Object.hasOwn(body, field)) {
      updates[field] = body[field];
    }
  }
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'At least one editable field is required' });
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json(updatedBook);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update book' });
  }
});

module.exports = router;
