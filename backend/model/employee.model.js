const { default: mongoose } = require("mongoose");

const employeeSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceShop', 
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  phone: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  entryTime:{
    type:String,
    required:true,
  },
  exitTime:{
   type:String,
   required:true,
  },
  slotTime: {
    type: Number,
    required: true,
    min: 10,
    max: 180
  }
},{
  timestamps:true
});
const Employee= mongoose.model("Employee",employeeSchema);
module.exports = Employee;

