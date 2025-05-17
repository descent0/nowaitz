const express = require("express");
const { 
  getAllSchedules,
  getScheduleById,
  getScheduleByShopId,
  updateScheduleById,
  deleteScheduleById,
  getSchedulesByEmployee,
  getAvailableSchedules,
  getScheduleByDate,
  getScheduleByDateAndEmployee
} = require("../controller/schedule.controller"); 

const scheduleRouter = express.Router();

// Get all schedules
scheduleRouter.get("/", getAllSchedules);

// Get a schedule by ID
scheduleRouter.get("/id/:id", getScheduleById);

// Get schedules by shopId
scheduleRouter.get("/shop/:shopId", getScheduleByShopId);

// Get schedules by employeeId
scheduleRouter.get("/employee/:employeeId", getSchedulesByEmployee);

// Get schedules by date
scheduleRouter.get("/date", getScheduleByDate);

// Get available schedules by date
scheduleRouter.get("/available", getAvailableSchedules);

// Get schedules by date and employeeId
scheduleRouter.get("/date/employee", getScheduleByDateAndEmployee);

// Update a schedule by ID
scheduleRouter.put("/id/:id", updateScheduleById);

// Delete a schedule by ID
scheduleRouter.delete("/id/:id", deleteScheduleById);

module.exports = scheduleRouter;
