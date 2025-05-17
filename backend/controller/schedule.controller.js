const { Schedule } = require("../model/schedule.model");


const handleResponse = (res, data, notFoundMessage) => {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return res.status(404).json({ message: notFoundMessage });
  }
  res.status(200).json(data);
};

const handleError = (res, error, message) => {
  // Check if the error is an instance of a specific error type (e.g., mongoose validation error)
  console.log(error);
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: "Validation Error", error: error.message });
  }

  // If it's a database connection error
  if (error.name === "MongoNetworkError") {
    return res.status(500).json({ message: "Database Connection Error", error: error.message });
  }

  // For general errors
  res.status(500).json({ message, error: error.message });
};

const getSchedules = async (filter, res, notFoundMessage) => {
  try {
    console.log(filter);
    const schedules = await Schedule.find(filter);
    handleResponse(res, schedules, notFoundMessage);
  } catch (error) {
    handleError(res, error, "Error fetching schedules");
  }
};


const getAllSchedules = (req, res) => getSchedules({}, res, "No schedules found");
const getScheduleById = (req, res) => getSchedules({ _id: req.params.id }, res, "Schedule not found");
const getScheduleByShopId = (req, res) => getSchedules({ shopId: req.params.shopId }, res, "No schedules found for this shop");
const getSchedulesByEmployee = (req, res) => getSchedules({ employeeId: req.params.employeeId }, res, "No schedules found for this employee");
const getScheduleByDate = (req, res) => getSchedules({ date: new Date(req.query.date) }, res, "No schedules found for this date");
const getAvailableSchedules = (req, res) => getSchedules({ date: req.query.date, isBooked: false }, res, "No available schedules for this date");
const getScheduleByDateAndEmployee = (req, res) => getSchedules({ date: (req.query.date), employeeId: req.query.employeeId }, res, "No schedules found for this employee on this date");

const updateScheduleById = async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("shopId employeeId");
    handleResponse(res, updatedSchedule, "Schedule not found");
  } catch (error) {
    handleError(res, error, "Error updating schedule");
  }
};

const deleteScheduleById = async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
    handleResponse(res, deletedSchedule, "Schedule not found");
  } catch (error) {
    handleError(res, error, "Error deleting schedule");
  }
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  getScheduleByShopId,
  updateScheduleById,
  deleteScheduleById,
  getSchedulesByEmployee,
  getAvailableSchedules,
  getScheduleByDate,
  getScheduleByDateAndEmployee,
};