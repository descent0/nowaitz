const express = require("express");
const { createOrder, verifyPayment, capturePayment, cancelPayment, refundPayment, fetchOrder, fetchPayment, fetchRefund } = require("../controller/payment.controller");

const paymentRouter = express.Router();

// Update the route to match frontend request
paymentRouter.post("/order", createOrder);

// 🔹 Verify payment signature
paymentRouter.post("/payment/verify", verifyPayment);

// 🔹 Capture payment manually (if manual capture is enabled)
paymentRouter.post("/payment/capture", capturePayment);

// 🔹 Cancel an authorized payment (only if not captured)
paymentRouter.post("/payment/cancel", cancelPayment);

// 🔹 Refund a captured payment (full or partial)
paymentRouter.post("/payment/refund", refundPayment);

// 🔹 Fetch details of a specific order
paymentRouter.get("/order/:order_id", fetchOrder);

// 🔹 Fetch details of a specific payment
paymentRouter.get("/payment/:payment_id", fetchPayment);

// 🔹 Fetch details of a refund
paymentRouter.get("/refund/:refund_id", fetchRefund);

module.exports = paymentRouter;
