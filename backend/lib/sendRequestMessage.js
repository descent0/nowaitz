const sendEmail = require("./sendEmail");

const sendMessage = async (appointment) => {
    try {
        // Validate required fields
        if (!appointment.customer || !appointment.customer.email || !appointment.shop) {
            console.error("Missing required appointment data for email");
            throw new Error("Missing required appointment data");
        }

        let subject = `Appointment Request Update - ${appointment.shop.name}`;
        let statusText = appointment.requestStatus === 'Approved' ? 'approved' : 'rejected';
        let requestTypeText = appointment.requestType ? appointment.requestType.toLowerCase() : 'request';
        
        let message = `Dear ${appointment.customer.name},

Your ${requestTypeText} for your appointment at ${appointment.shop.name} has been ${statusText}.`;

        let html = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #333; margin: 0;">${appointment.shop.name}</h2>
        <p style="color: #666; margin: 5px 0;">Appointment Update</p>
    </div>
    
    <p style="color: #333;">Dear <strong>${appointment.customer.name}</strong>,</p>
    
    <p style="color: #333;">
        Your <strong style="color: #007bff;">${requestTypeText}</strong> request for your appointment at 
        <strong>${appointment.shop.name}</strong> has been 
        <strong style="color: ${statusText === 'approved' ? '#28a745' : '#dc3545'};">${statusText.toUpperCase()}</strong>.
    </p>`;

        // Handle different scenarios
        if (appointment.requestStatus === 'Approved') {
            if (appointment.requestType === 'Cancellation') {
                message += `

Your appointment has been successfully cancelled. We're sorry to see you go, but we understand that sometimes plans change.`;

                html += `
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; color: #333;">
            <strong>✅ Cancellation Confirmed</strong><br>
            Your appointment has been successfully cancelled. We're sorry to see you go, but we understand that sometimes plans change.
        </p>
    </div>`;
            } 
            else if (appointment.requestType === 'Rescheduling') {
                if (appointment.rescheduleDate && appointment.rescheduleSlot) {
                    const newDate = new Date(appointment.rescheduleDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    message += `

Your appointment has been successfully rescheduled to:
📅 Date: ${newDate}
⏰ Time: ${appointment.rescheduleSlot}
📍 Location: ${appointment.shop.address || 'As previously arranged'}`;

                    html += `
    <div style="background-color: #e7f3ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007bff;">
        <h3 style="color: #007bff; margin-top: 0;">🔄 New Appointment Details</h3>
        <p style="margin: 10px 0; color: #333;">
            <strong>📅 Date:</strong> ${newDate}<br>
            <strong>⏰ Time:</strong> ${appointment.rescheduleSlot}<br>
            <strong>📍 Location:</strong> ${appointment.shop.address || 'As previously arranged'}
        </p>
    </div>`;
                } else {
                    message += `

Your rescheduling request has been approved. You will receive the new appointment details shortly.`;

                    html += `
    <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; color: #333;">
            <strong>✅ Rescheduling Approved</strong><br>
            Your rescheduling request has been approved. You will receive the new appointment details shortly.
        </p>
    </div>`;
                }
            }
        } else if (appointment.requestStatus === 'Rejected') {
            message += `

Unfortunately, your ${requestTypeText} request could not be processed at this time. Please contact us if you have any questions or would like to discuss alternative options.`;

            html += `
    <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <p style="margin: 0; color: #333;">
            <strong>❌ Request Not Approved</strong><br>
            Unfortunately, your ${requestTypeText} request could not be processed at this time. 
            Please contact us if you have any questions or would like to discuss alternative options.
        </p>
    </div>`;
        }

        // Add contact information
        message += `

If you have any questions or concerns, please don't hesitate to contact us.

Thank you for choosing ${appointment.shop.name}!

Best regards,
The ${appointment.shop.name} Team`;

        html += `
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #333;">If you have any questions or concerns, please don't hesitate to contact us.</p>
        <p style="color: #333;">Thank you for choosing <strong>${appointment.shop.name}</strong>!</p>
        <p style="color: #666; margin-bottom: 0;">
            Best regards,<br>
            <strong>The ${appointment.shop.name} Team</strong>
        </p>
    </div>
</div>`;

        console.log(`Sending email to: ${appointment.customer.email}`);
        console.log(`Subject: ${subject}`);

        await sendEmail({
            to: appointment.customer.email,
            subject,
            text: message,
            html,
        });

        console.log("Email sent successfully");
        return true;

    } catch (error) {
        console.error("Error in sendMessage:", error);
        throw error;
    }
};

module.exports = {
    sendMessage,
};