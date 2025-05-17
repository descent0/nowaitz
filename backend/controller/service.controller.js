const Service = require("../model/service.model");

const handleErrors = (err) => {
    if (err.code === 11000) {
        return { status: 400, message: 'A service with this name already exists' };
    }
    if (err.name === 'ValidationError') {
        return { status: 400, message: Object.values(err.errors).map(e => e.message).join(', ') };
    }
    return { status: 500, message: 'Internal server error' };
};

// Create a new service
const createService = async (req, res) => {
    try {
        const service = new Service({
            shopId: req.body.shopId,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            duration: req.body.duration
        });

        const savedService = await service.save();
        res.status(201).json(savedService);
    } catch (err) {
        const error = handleErrors(err);
        res.status(error.status).json({ error: error.message });
    }
};

// Get all services (with optional filtering)
const getAllServices = async (req, res) => {
    try {
        const filters = {};
        
        if (req.query.shopId) {
            filters.shopId = req.query.shopId;
        }

        if (req.query.minPrice || req.query.maxPrice) {
            filters.price = {};
            if (req.query.minPrice) filters.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filters.price.$lte = Number(req.query.maxPrice);
        }

        if (req.query.duration) {
            filters.duration = Number(req.query.duration);
        }

        const services = await Service.find(filters)
            .populate('shopId', 'name location')
            .sort({ createdAt: -1 });

        res.json(services);
    } catch (err) {
        const error = handleErrors(err);
        res.status(error.status).json({ error: error.message });
    }
};

// Get a single service by ID
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('shopId', 'name location');

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.json(service);
    } catch (err) {
        const error = handleErrors(err);
        res.status(error.status).json({ error: error.message });
    }
};

// Update a service
const updateService = async (req, res) => {
    try {
        const updates = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            duration: req.body.duration
        };

        const service = await Service.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.json(service);
    } catch (err) {
        const error = handleErrors(err);
        res.status(error.status).json({ error: error.message });
    }
};

// Delete a service
const deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.json({ message: 'Service deleted successfully' });
    } catch (err) {
        const error = handleErrors(err);
        res.status(error.status).json({ error: error.message });
    }
};

// Get services by shop ID
const getServicesByShop = async (req, res) => {
    try {
        const services = await Service.find({ shopId: req.params.shopId })
            .sort({ createdAt: -1 });

        res.json(services);
    } catch (err) {
        const error = handleErrors(err);
        res.status(error.status).json({ error: error.message });
    }
};

// Search services by name or description
const searchServices = async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const services = await Service.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } }
            ]
        }).populate('shopId', 'name location');

        res.json(services);
    } catch (err) {
        const error = handleErrors(err);
        res.status(error.status).json({ error: error.message });
    }
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    getServicesByShop,
    searchServices
};
