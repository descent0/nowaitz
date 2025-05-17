const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGE_SERVICE_ID;
const phone=process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendSMS = async (phoneNumber, message) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: phone,
            to: phoneNumber
        });
        console.log("SMS sent successfully! Message SID:", response.sid);
    } catch (error) {
        console.error('SMS sending failed:', error.message);
    }
};




const sanitizeAppointment = (appointment) => {
    const sanitized = { ...appointment.toObject() };
    if (sanitized.customer) {
        delete sanitized.customer.password;
    }
    return sanitized;
};

module.exports={
    sendSMS,
    sanitizeAppointment
}