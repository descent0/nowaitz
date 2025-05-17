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
 * @desc Capture an authorized payment
 */
const capturePayment = async (req, res) => {
  try {
    const { payment_id, amount } = req.body;

    if (!payment_id || !amount) {
      return res.status(400).json({ success: false, error: "Payment ID and amount required" });
    }

    const capture = await razorpayInstance.payments.capture(payment_id, amount * 100, "INR");
    return res.status(200).json({ success: true, data: capture });
  } catch (error) {
    console.error("Error capturing payment:", error);
    return res.status(500).json({ success: false, error: "Failed to capture payment" });
  }
};

/**
 * @desc Cancel an authorized payment (only possible before capture)
 */
const cancelPayment = async (req, res) => {
  try {
    const { payment_id } = req.body;

    if (!payment_id) {
      return res.status(400).json({ success: false, error: "Payment ID required" });
    }

    const payment = await razorpayInstance.payments.fetch(payment_id);

    if (payment.status !== "authorized") {
      return res.status(400).json({ success: false, error: "Only authorized payments can be canceled" });
    }

    const canceledPayment = await razorpayInstance.payments.cancel(payment_id);
    return res.status(200).json({ success: true, data: canceledPayment });
  } catch (error) {
    console.error("Error canceling payment:", error);
    return res.status(500).json({ success: false, error: "Failed to cancel payment" });
  }
};

/**
 * @desc Refund a captured payment (full or partial)
 */
const refundPayment = async (req, res) => {
  try {
    const { payment_id, amount } = req.body;

    if (!payment_id) {
      return res.status(400).json({ success: false, error: "Payment ID required" });
    }

    const refundOptions = amount ? { amount: amount * 100 } : {};
    const refund = await razorpayInstance.payments.refund(payment_id, refundOptions);

    return res.status(200).json({ success: true, data: refund });
  } catch (error) {
    console.error("Error processing refund:", error);
    return res.status(500).json({ success: false, error: "Failed to process refund" });
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
  capturePayment,
  cancelPayment,
  refundPayment,
  fetchOrder,
  fetchPayment,
  fetchRefund,
};
