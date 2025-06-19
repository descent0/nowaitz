const express = require("express");
const { createOrder, verifyPayment, capturePayment, cancelPayment, refundPayment, fetchOrder, fetchPayment, fetchRefund } = require("../controller/payment.controller");
const { protect } = require("../middleware/protect");

const paymentRouter = express.Router();

paymentRouter.post("/order",protect('user'), createOrder);

paymentRouter.post("/payment/verify",protect('user'), verifyPayment);

paymentRouter.post("/payment/capture",protect('user'), capturePayment);


paymentRouter.post("/payment/cancel",protect('user'), cancelPayment);

paymentRouter.post("/payment/refund",protect('user'), refundPayment);


paymentRouter.get("/order/:order_id",protect('user'), fetchOrder);


paymentRouter.get("/payment/:payment_id", fetchPayment);

// 🔹 Fetch details of a refund
paymentRouter.get("/refund/:refund_id", fetchRefund);

module.exports = paymentRouter;
