const express = require('express');
const { createService, getAllServices, getServiceById, updateService, deleteService, getServicesByShop, searchServices } = require('../controller/service.controller');
const { protectShop } = require('../middleware/protectShop');
const { protect } = require('../middleware/protect');
const serviceRouter = express.Router();

serviceRouter.post('/services', protectShop, createService);

serviceRouter.get('/services',protect('user'), getAllServices);

serviceRouter.get('/services/:id', getServiceById);

serviceRouter.put('/services/:id', protectShop, updateService);

serviceRouter.delete('/services/:id',protectShop, deleteService);

serviceRouter.get('/services/shop/:shopId', getServicesByShop);

serviceRouter.get('/search', searchServices);

module.exports = serviceRouter;
