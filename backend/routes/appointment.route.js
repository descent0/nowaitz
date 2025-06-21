const express = require('express');
const appointmentRouter = express.Router();
const appointmentController = require('../controller/appointment.controller');
const { protect } = require('../middleware/protect');
const { protectShop } = require('../middleware/protectShop');

appointmentRouter.post('/', appointmentController.createAppointment);
appointmentRouter.get('/fetchAllAppointment', appointmentController.getAllAppointments);
appointmentRouter.get('/:id', appointmentController.getAppointment);

appointmentRouter.patch('/:id/status', appointmentController.updateStatus);


appointmentRouter.post('/:id/cancel', appointmentController.cancelAppointment);

appointmentRouter.get('/user/:userId', appointmentController.getUserAppointments);


appointmentRouter.get('/shop/:shopId', appointmentController.getShopAppointments);






appointmentRouter.post('/:id/request',protect('user'), appointmentController.requestChange);
appointmentRouter.post('/:id/verify-request',protectShop, appointmentController.handleRequest);

module.exports = appointmentRouter;
