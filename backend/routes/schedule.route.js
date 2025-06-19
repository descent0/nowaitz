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
const { protect } = require("../middleware/protect");
const { protectShop } = require("../middleware/protectShop");

const scheduleRouter = express.Router();

scheduleRouter.get("/", protect('user'), getAllSchedules);

scheduleRouter.get("/id/:id", getScheduleById);

scheduleRouter.get("/shop/:shopId", getScheduleByShopId);


scheduleRouter.get("/employee/:employeeId", getSchedulesByEmployee);


scheduleRouter.get("/date", getScheduleByDate);


scheduleRouter.get("/available", getAvailableSchedules);


scheduleRouter.get("/date/employee", getScheduleByDateAndEmployee);

scheduleRouter.put("/id/:id", protectShop, updateScheduleById);

scheduleRouter.delete("/id/:id",protectShop, deleteScheduleById);

module.exports = scheduleRouter;
