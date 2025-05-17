const Category = require('../model/category.model');

const createCategory = async (name) => {
  try {
    const newCategory = new Category({ name });
    await newCategory.save();
    console.log("Category created successfully:", newCategory);
  } catch (err) {
    console.error("Error creating category:", err);
    throw err;
  }
};

module.exports = { createCategory };