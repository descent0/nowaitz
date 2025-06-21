const axios = require('axios');


const Razorpay = require('razorpay');
const Appointment = require('../model/appointment.model');
const { Schedule } = require('../model/schedule.model');
const sendEmail = require('./sendEmail');
const { sanitizeAppointment } = require('./sanitise');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const sendConfirmationMessage = async (appointment) => {
    console.log("Sending confirmation message for appointment:", appointment);
    const message = `Dear ${appointment.customer.name},

Your appointment at ${appointment.shop.name} has been successfully confirmed.

📅 Date: ${appointment.schedule[0].date}
⏰ Time: ${appointment.schedule[0].slot}
📍 Location: ${appointment.shop.address}

Please make sure to arrive 5-10 minutes early. If you have any questions or need to reschedule, feel free to contact us.

Thank you for choosing ${appointment.shop.name}!

Best regards,  
${appointment.shop.name} Team`;

const html=`
<div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <p>Dear ${appointment.customer.name},</p>
    <p>Your appointment at <strong>${appointment.shop.name}</strong> has been successfully confirmed.</p>
    <p>
        <strong>📅 Date:</strong> ${appointment.schedule[0].date}<br>
        <strong>⏰ Time:</strong> ${appointment.schedule[0].slot}<br>
        <strong>📍 Location:</strong> ${appointment.shop.location}
    </p>
    <p>Please make sure to arrive 5-10 minutes early. If you have any questions or need to reschedule, feel free to contact us.</p>
    <p>Thank you for choosing <strong>${appointment.shop.name}</strong>!</p>
    <p>Best regards,<br>${appointment.shop.name} Team</p>
</div>
`


    await sendEmail({
        to: "rajputdishant891@gmail.com",
        subject: `Appointment Confirmation at ${appointment.shop.name}`,
        text: message,
        html: html,
    });
};

const createAppointment = async (appointmentData) => {
    console.log("appointmentData",appointmentData);
    const appointment = new Appointment({
        ...appointmentData,
        status: 'Confirmed',
        paymentStatus: 'Pending',
    })
    await appointment.save();
    console.log("scheduling BRO ",appointmentData.schedule);
    const result = await Schedule.updateMany(
        { _id: { $in: appointment.schedule } }, 
        { $set: { isBooked: true } } 
    );
    console.log(result);

    return sanitizeAppointment(appointment);
};

const getAllAppointments = async () => {
    const appointments = await Appointment.find().populate('customer shop service schedule').lean();
    return appointments.map(sanitizeAppointment);
};

const getAppointmentById = async (appointmentId) => {
    const appointment = await Appointment.findById(appointmentId).populate('customer shop service schedule');
    if (!appointment) throw new Error('Appointment not found');
    return sanitizeAppointment(appointment);
};

const updateAppointmentStatus = async (razorpay_order_id, updateData) => {
    console.log("Searching for appointment with:", razorpay_order_id);
    
    const appointment = await Appointment.findOne({razorpayOrderId: razorpay_order_id });
    console.log("Found appointment:", appointment);

    if (!appointment) throw new Error('Appointment not found');

    await Appointment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { $set: updateData },
        { new: true, runValidators: true }
    );
    const updatedAppointment = await Appointment.findOne({ razorpayOrderId: razorpay_order_id })
    .populate('customer', 'name email phone')
    .populate('shop', 'name location')
    .populate('service', 'name price')
    .populate('schedule', 'date slot');

    console.log("Updated Appointment:", updatedAppointment);
sendConfirmationMessage(updatedAppointment);
    return sanitizeAppointment(updatedAppointment);
};


module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    sendConfirmationMessage
};
