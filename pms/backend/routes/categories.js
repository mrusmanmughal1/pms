const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');

// Get all categories (public/authenticated)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new category - admin only
router.post(
  '/',
  protect,
  authorize('Admin'),
  async (req, res) => {
    try {
      const { name, budget = 0 } = req.body;
      if (!name) return res.status(400).json({ message: 'Category name is required' });
      if (budget < 0) return res.status(400).json({ message: 'Budget must be at least 0' });

      const existing = await Category.findOne({ name });
      if (existing) return res.status(400).json({ message: 'Category already exists' });

      const category = await Category.create({ name, budget });
      res.status(201).json(category);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Update a category budget - admin only
router.put(
  '/:id',
  protect,
  authorize('Admin'),
  async (req, res) => {
    try {
      const { name, budget } = req.body;
      if (budget == null || Number(budget) < 0) {
        return res.status(400).json({ message: 'Budget must be provided and at least 0' });
      }



      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).json({ message: 'Category not found' });

      if (name) {
        const existing = await Category.findOne({ name, _id: { $ne: category._id } });
        if (existing) return res.status(400).json({ message: 'Another category with this name already exists' });
        category.name = name;
      }
      category.budget = Number(budget);
      await category.save();
      res.json(category);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Delete a category - admin only
router.delete(
  '/:id',
  protect,
  authorize('Admin'),
  async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).json({ message: 'Category not found' });

      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
