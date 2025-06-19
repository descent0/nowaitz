const express = require('express');
const { getAllCategories, getCategoryById, updateCategory, deleteCategory, getAllApprovedCategories } = require('../controller/category.controller');
const { protect } = require('../middleware/protect');
const CategoryRouter = express.Router();

CategoryRouter.get('/',protect('admin'), getAllCategories);
CategoryRouter.get('/approved',protect('user'), getAllApprovedCategories);
CategoryRouter.get('/:id', getCategoryById);
CategoryRouter.put('/:id', protect('admin'),updateCategory);
CategoryRouter.delete('/:id',protect('admin'), deleteCategory);

module.exports = CategoryRouter;
