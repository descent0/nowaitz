const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceShop',
    required: true
  },
  service: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', 
    required: true
  }],
  schedule: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true
  }],

  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Online', 'Wallet', 'Razorpay'],
    default: 'Razorpay'
  },
  razorpayOrderId: {
    type: String, 
    required: true
  },
  razorpayPaymentId: {
    type: String, 
  },
  razorpaySignature: {
    type: String, 
  },
  reminderSent: {
    type: Boolean,
    default: false 
  },
  reminderDate: {
    type: Date 
  },
  customerFeedback: {
    type: String, 
    trim: true
  },
  feedbackRating: {
    type: Number, 
    min: 1,
    max: 5
  },
  cancellationReason: {
    type: String, 
    enum: ['Customer Request', 'Shop Closed', 'Service Unavailable', 'Other'],
    trim: true
  },
  cancellationFee: {
    type: Number, 
    min: 0
  },
  requestType: {
    type: String,
    enum: ['Cancellation', 'Rescheduling', null],
    default: null,
  },
  requestStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', null],
    default: null,
  },
  requestReason: {
    type: String,
    trim: true,
  },
  rescheduleDate: {
    type: Date, // For rescheduling requests
  },
  rescheduleSlot: {
    type: String, // For rescheduling requests
  }
}, {
  timestamps: true 
});

// Create the Appointment (Slot Booking) model
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
