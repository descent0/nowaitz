const Razorpay = require("razorpay");
const crypto = require("crypto");
const { createAppointment, updateAppointmentStatus, sendConfirmationMessage } = require("../lib/appointmentFunctions");

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const createOrder = async (req, res) => {
  try {
    console.log("Incoming request to create order:", req.body);
    let { amount, currency = "INR", notes } = req.body;

    // If amount is an object, extract the numeric value
    if (typeof amount === "object" && amount.amount) {
      amount = amount.amount;
    }

    if (!amount || amount <= 0) {
      console.log("Invalid amount specified:", amount);
      return res.status(400).json({ success: false, error: "Invalid amount specified" });
    }

    const options = {
      amount: amount * 100, // Convert to paisa
      currency,
      receipt: `order_${Date.now()}`,
      notes: { ...notes, created_at: new Date().toISOString() },
    };
  
    console.log("Order options:", options);
    const order = await razorpayInstance.orders.create(options);

    const appointmentData={
      customer:req.body.user._id,
      shop:req.body.shopId,
      service:req.body.serviceIds,
      schedule:req.body.slotIds,
      totalAmount:req.body.amount,
      razorpayOrderId:order.id
      
          }
    console.log("Order created successfully:", order);
    console.log("appointment data",appointmentData);
    const appointment = await createAppointment(appointmentData);
    console.log(appointment);
    
    return res.status(200).json({ success: true, data: order, appointment:appointment });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ success: false, error: "Failed to create order" });
  }
};

/**
 * Verify payment signature after checkout
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    console.log(razorpay_order_id);

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: "Missing required parameters" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid payment signature" });
    }

    // Optionally, fetch payment details for further verification
    const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);
    if (payment.status !== "captured") {
      return res.status(400).json({ success: false, error: `Payment status is ${payment.status}` });
    }
    updateAppointmentStatus(razorpay_order_id ,{razorpayPaymentId:razorpay_payment_id,razorpaySignature:razorpay_signature, paymentStatus:"Paid"})

  
    return res.status(200).json({
      success: true,
      data: {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        payment_details: payment,
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ success: false, error: "Failed to verify payment" });
  }
};

/**
 * @desc Fetch order details
 */
const fetchOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    if (!order_id) {
      return res.status(400).json({ success: false, error: "Order ID required" });
    }

    const order = await razorpayInstance.orders.fetch(order_id);
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch order" });
  }
};

/**
 * @desc Fetch payment details
 */
const fetchPayment = async (req, res) => {
  try {
    const { payment_id } = req.params;

    if (!payment_id) {
      return res.status(400).json({ success: false, error: "Payment ID required" });
    }

    const payment = await razorpayInstance.payments.fetch(payment_id);
    return res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error("Error fetching payment:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch payment" });
  }
};

/**
 * @desc Fetch refund details
 */
const fetchRefund = async (req, res) => {
  try {
    const { refund_id } = req.params;

    if (!refund_id) {
      return res.status(400).json({ success: false, error: "Refund ID required" });
    }

    const refund = await razorpayInstance.refunds.fetch(refund_id);
    return res.status(200).json({ success: true, data: refund });
  } catch (error) {
    console.error("Error fetching refund:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch refund" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  fetchOrder,
  fetchPayment,
  fetchRefund,
};
