
const sanitizeAppointment = (appointment) => {
    const sanitized = { ...appointment.toObject() };
    if (sanitized.customer) {
        delete sanitized.customer.password;
    }
    return sanitized;
};

module.exports={
    sanitizeAppointment
}