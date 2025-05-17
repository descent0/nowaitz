const express = require('express');
const { getAllCategories, getCategoryById, updateCategory, deleteCategory, getAllApprovedCategories } = require('../controller/category.controller');
const CategoryRouter = express.Router();

CategoryRouter.get('/', getAllCategories);
CategoryRouter.get('/approved', getAllApprovedCategories);
CategoryRouter.get('/:id', getCategoryById);
CategoryRouter.put('/:id', updateCategory);
CategoryRouter.delete('/:id', deleteCategory);

module.exports = CategoryRouter;
