const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  shopId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: { type: Date, required: true },
  slot: { type: String, required: true },
  isBooked:{
    type: Boolean,
    default: false,
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports={
    Schedule
}
