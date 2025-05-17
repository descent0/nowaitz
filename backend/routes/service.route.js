const express = require('express');
const { createService, getAllServices, getServiceById, updateService, deleteService, getServicesByShop, searchServices } = require('../controller/service.controller');
const serviceRouter = express.Router();


// Route for creating a new service
serviceRouter.post('/services', createService);

// Route for getting all services (with optional filtering)
serviceRouter.get('/services', getAllServices);

// Route for getting a single service by ID
serviceRouter.get('/services/:id', getServiceById);

// Route for updating a service
serviceRouter.put('/services/:id', updateService);

// Route for deleting a service
serviceRouter.delete('/services/:id', deleteService);

// Route for getting services by shop ID
serviceRouter.get('/services/shop/:shopId', getServicesByShop);

// Route for searching services by name or description
serviceRouter.get('/search', searchServices);

module.exports = serviceRouter;
