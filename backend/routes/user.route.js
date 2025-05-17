const express = require('express');
const {
    login,
    signup,
    logout,
    checkAuth,
    getAllUsers,
    updateUser,
    sendOtp,
    verifyOtp,
    forgotPassword,
} = require('../controller/user.controller');
const { protect } = require('../middleware/protect');
const passport = require('passport');
const { generateToken } = require('../lib/jwtgen');

const userRouter = express.Router();

const validateSignup = (req, res, next) => {
    const { name, email, phone, address, password } = req.body;
    if (!name || !email || !phone || !address || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    next();
};

// Existing routes
userRouter.post("/login", login);
userRouter.post("/signup", validateSignup, signup);
userRouter.post("/logout", logout);
userRouter.get("/checkAuth", protect, checkAuth);

userRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

userRouter.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    async (req, res) => {
        try {
            console.log("before calling generate token");
            const token = generateToken(req.user._id, res);
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict'
            });
            res.redirect('http://localhost:3000');
        } catch (err) {
            console.error('Error during authentication:', err);
            res.status(500).json({ message: 'Authentication failed', error: err });
        }
    }
);

// New routes for OTP and forgot password
userRouter.post("/send-otp", sendOtp); // Route to send OTP
userRouter.post("/verify-otp", verifyOtp); // Route to verify OTP
userRouter.post("/forgot-password", forgotPassword); // Route for forgot password

userRouter.get("/", getAllUsers);
userRouter.put("/:id", protect, updateUser); // Route for updating user

module.exports = {
    userRouter,
};