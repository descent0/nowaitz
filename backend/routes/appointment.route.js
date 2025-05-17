const express = require('express');
const appointmentRouter = express.Router();
const appointmentController = require('../controller/appointment.controller');

// CRUD Operations
appointmentRouter.post('/', appointmentController.createAppointment);
appointmentRouter.get('/:id', appointmentController.getAppointment);

// Payment related routes
appointmentRouter.patch('/:id/payment', appointmentController.updatePayment);

// Status and feedback routes
appointmentRouter.patch('/:id/status', appointmentController.updateStatus);
appointmentRouter.post('/:id/feedback', appointmentController.handleFeedback);

// Cancellation routes
appointmentRouter.post('/:id/cancel', appointmentController.cancelAppointment);

// User-specific routes
appointmentRouter.get('/user/:userId', appointmentController.getUserAppointments);

// Shop-specific routes
appointmentRouter.get('/shop/:shopId', appointmentController.getShopAppointments);

// Statistics and reports
appointmentRouter.get('/stats/all', appointmentController.getStatistics);

// Query and filter routes
appointmentRouter.get('/query', appointmentController.queryAppointments);

// Reminder routes
appointmentRouter.patch('/:id/reminder', appointmentController.handleReminder);

// Request change routes
appointmentRouter.post('/:id/request', appointmentController.requestChange);
appointmentRouter.post('/:id/verify-request', appointmentController.handleRequest);

module.exports = appointmentRouter;
