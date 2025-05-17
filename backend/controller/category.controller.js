const Category = require('../model/category.model'); // Fix the import path

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name, description, image, status } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description, image, status },
            { new: true, runValidators: true }
        );
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, message: 'Category updated successfully', category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllApprovedCategories = async (req, res) => {
    try {
        console.log("Inside the controller");
        const categories = await Category.find({ status: 'Approved' });
        console.log("Fetched categories:", categories);
        res.status(200).json({ success: true, categories });
    } catch (error) {
        console.error("Error fetching approved categories:", error); // Add detailed logging
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { 
    getAllCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory ,
    getAllApprovedCategories
};
