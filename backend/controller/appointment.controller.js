const Appointment = require('../model/appointment.model');
const { Schedule } = require('../model/schedule.model');

// Create new appointment
const createAppointment = async (req, res) => {
    try {
        const appointmentData = req.body;
        const appointment = await Appointment.create(appointmentData);
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get appointment by ID with populated references
const getAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('customer')
            .populate('shop')
            .populate('service')
            .populate('schedule');
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get all appointment
const getAllAppointments = async (req, res) => {
    try {
        console.log("get all appointment called");
        const appointments = await Appointment.find()
            .populate('customer')
            .populate('shop')
            .populate('service')
            .populate('schedule');
        console.log(appointments);
        res.json(appointments);
    } catch (error) {
        console.error("Error in getAllAppointments:", error); // Add this line
        res.status(500).json({ message: error.message });
    }
};

// Update payment details
const updatePayment = async (req, res) => {
    try {
        const { paymentStatus, razorpayPaymentId, razorpaySignature } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { paymentStatus, razorpayPaymentId, razorpaySignature },
            { new: true }
        );
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Handle appointment status changes
const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add or update feedback
const handleFeedback = async (req, res) => {
    try {
        const { customerFeedback, feedbackRating } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { customerFeedback, feedbackRating },
            { new: true }
        );
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Handle cancellation
const cancelAppointment = async (req, res) => {
    try {
        const { cancellationReason, cancellationFee } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { 
                status: 'Cancelled',
                cancellationReason,
                cancellationFee,
            },
            { new: true }
        );
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const requestByCustomer= async(req, res) => {
    try {
        const { customerId } = req.params;
        const { status, paymentStatus, shop } = req.query;
        let query = { customer: customerId };
        if (status) query.status = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;
        if (shop) query.shop = shop;
        const appointments = await Appointment.find(query)


            .populate('customer')
            .populate('shop')
            .populate('service')
            .populate('schedule')
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get appointments by query parameters
const queryAppointments = async (req, res) => {
    try {
        const query = {};
        if (req.query.status) query.status = req.query.status;
        if (req.query.paymentStatus) query.paymentStatus = req.query.paymentStatus;
        if (req.query.shop) query.shop = req.query.shop;
        if (req.query.customer) query.customer = req.query.customer;

        const appointments = await Appointment.find(query)
            .populate('customer')
            .populate('shop')
            .populate('service')
            .populate('schedule')
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Handle appointment reminders
const handleReminder = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { 
                reminderSent: true,
                reminderDate: new Date()
            },
            { new: true }
        );
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get appointments statistics
const getStatistics = async (req, res) => {
    try {
        const stats = await Appointment.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get appointments by user ID
const getUserAppointments = async (req, res) => {
    try {
        const { status, sort = 'desc' } = req.query;
        let query = { customer: req.params.userId };
        
        if (status) {
            query.status = status;
        }

        const appointments = await Appointment.find(query)
        .populate('shop', 'name shopID category')
        .populate('customer', 'name email phone')
        .populate('service', 'name price duration')
        .populate('schedule', 'date slot')
        .sort({ createdAt: sort === 'desc' ? -1 : 1 });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get appointments by shop ID
const getShopAppointments = async (req, res) => {
    try {
        const { 
            status, 
            date, 
            paymentStatus,
            sort = 'asc' 
        } = req.query;

        let query = { shop: req.params.shopId };
        
        if (status) query.status = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query['schedule.date'] = {
                $gte: startDate,
                $lt: endDate
            };
        }

        const appointments = await Appointment.find(query)
            .populate('customer', 'name email phone')
            .populate('service', 'name price duration')
            .populate('schedule', 'date slot')
            .sort({ 'schedule.date': sort === 'desc' ? -1 : 1 });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Handle appointment change requests
const requestChange = async (req, res) => {
    try {
        const { requestType, requestReason, rescheduleDate, rescheduleSlot } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                requestType,
                requestStatus: 'Pending',
                requestReason,
                rescheduleDate: requestType === 'Rescheduling' ? rescheduleDate : undefined,
                rescheduleSlot: requestType === 'Rescheduling' ? rescheduleSlot : undefined,
            },
            { new: true }
        );

        if (!appointment||appointment.status !== 'Confirmed') {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json({ message: 'Request sent successfully', appointment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Handle appointment requests
const handleRequest = async (req, res) => {
    try {
        console.log("handle request called");
        
        const { requestStatus } = req.body;
        console.log(req.body);

        // Fetch the appointment by ID
        const appointment = await Appointment.findById(req.params.id).populate('schedule');

        // Check if the appointment exists and is confirmed
        if (!appointment || appointment.status !== 'Confirmed') {
            return res.status(404).json({ message: 'Appointment not found or not confirmed' });
        }

        // Handle rejected requests
        if (requestStatus === 'Rejected') {
            appointment.requestStatus = 'Rejected';
            appointment.rescheduleDate = null;
            appointment.rescheduleSlot = null;

            await appointment.save();
            return res.status(200).json({ message: 'Request rejected successfully', appointment });
        }
    //   console.log("requested appointemnt",appointment);
        // Handle approved cancellation requests
        if (requestStatus === 'Approved' && appointment.requestType === 'Cancellation') {
            await Schedule.findByIdAndUpdate(
                appointment.schedule._id,
                { $set: { isBooked: false } },
                { new: true }
            );
            await Appointment.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: 'Cancellation request approved and appointment deleted successfully' });
        }
        console.log("below this line")
        // Handle approved rescheduling requests
        if (requestStatus === 'Approved' && appointment.requestType === 'Rescheduling') {
            console.log("inside rescheduling request")
            console.log("reschedule date ", appointment.rescheduleDate);
            if (!appointment.rescheduleDate || !appointment.rescheduleSlot) {
                return res.status(400).json({ message: 'Reschedule date and slot are required for rescheduling' });
            }

            console.log("reschedule date ", new Date(appointment.rescheduleDate));

          
            const newSchedule = await Schedule.findOne({
                date: new Date(appointment.rescheduleDate),
                slot: appointment.rescheduleSlot,
                isBooked:false
            });
            console.log("new schedule", newSchedule);

            if (!newSchedule) {
                return res.status(404).json({ message: 'The requested schedule does not exist' });
            }

            // Mark the new schedule as booked
            newSchedule.isBooked = true;
            await newSchedule.save();

            // Keep the current schedule marked as booked
            const currentSchedule = await Schedule.findById(appointment.schedule._id);
            if (currentSchedule) {
                currentSchedule.isBooked = false;
                await currentSchedule.save();
            }

            // Update the appointment with the new schedule
            appointment.requestStatus = 'Approved';
            appointment.schedule = newSchedule;
            appointment.rescheduleDate = null;
            appointment.rescheduleSlot = null;

            await appointment.save();
            return res.status(200).json({ message: 'Rescheduling request approved successfully', appointment });
        }

        // If the requestStatus is invalid
        return res.status(400).json({ message: 'Invalid request status or request type' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAppointment,
    getAppointment,
    getAllAppointments,
    updatePayment,
    updateStatus,
    handleFeedback,
    cancelAppointment,
    queryAppointments,
    handleReminder,
    getStatistics,
    getUserAppointments,
    getShopAppointments,
    requestChange,
    handleRequest
};
