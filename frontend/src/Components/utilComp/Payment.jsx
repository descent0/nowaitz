import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, verifyPayment } from "../../store/paymentSlice";
import { fetchScheduleByDateAndEmployee } from './../../store/scheduleSlice';
import { useNavigate } from "react-router-dom";

// Move this outside the component so it's only loaded once
let razorpayScriptPromise = null;
const loadRazorpayScript = () => {
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve();
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.body.appendChild(script);
    });
  }
  return razorpayScriptPromise;
};

const PaymentComponent = ({ appointmentData }) => {
  console.log(appointmentData);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.payment);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const navigate=useNavigate();

  useEffect(() => {
    let isMounted = true;
    loadRazorpayScript()
      .then(() => {
        if (isMounted) setIsScriptLoaded(true);
      })
      .catch((error) => console.error("Razorpay SDK load error:", error));
    return () => { isMounted = false; };
  }, []);

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      console.error("Razorpay SDK not loaded");
      return;
    }

    const { amount, user, handlePaymentSuccess, handlePaymentError } = appointmentData;
    if (!user || !amount) {
      console.error("Missing user details or amount");
      return;
    }

    try {
      const orderData = await dispatch(createOrder(appointmentData)).unwrap();
      if (!orderData || !orderData.id) {
        throw new Error("Invalid order response from backend");
      }

      const { id: order_id, amount: orderAmount } = orderData;
    

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: "INR",
        name: "Your Business Name",
        description: "Appointment Payment",
        order_id,
        handler: async (response) => {
          try {
            await dispatch(verifyPayment(response)).unwrap();
            handlePaymentSuccess?.(response);
            <>
            <div className="text-xl text-red-600">congrats your , booking is confirmed </div>
            </>
            setTimeout(()=>{
              navigate("/profile",{replace:true});
            },1000);
           
            
          } catch (error) {
            console.error("Payment verification failed:", error);
            handlePaymentError?.(error);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: { color: "#6366F1" },
        modal: {
          ondismiss: () => console.log("Payment modal closed"),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      handlePaymentError?.(error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Complete Your Payment</h2>
        <div className="mb-4"></div>
        {error && <p className="text-red-500">{error}</p>}
        {!isScriptLoaded ? (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-600 py-2 px-4 rounded-md opacity-50 cursor-not-allowed"
          >
            Loading Payment...
          </button>
        ) : (
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition duration-150 ease-in-out"
          >
            {loading
              ? "Processing..."
              : `Pay INR ${appointmentData?.amount || ""}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentComponent;
