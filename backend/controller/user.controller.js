const { generateToken, generateRefreshToken } = require("../lib/jwtgen");
const bcrypt = require("bcryptjs");
const User = require("../model/user.model");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const signup = async (req, res) => {
  const { name, email, phone, address, password } = req.body;

  try {
    if (!name || !email || !phone || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!hasNumber.test(password) || !hasSpecialChar.test(password)) {
      return res
        .status(400)
        .json({
          message:
            "Password must contain at least one number and one special character",
        });
    }

    const user = await User.findOne({ email });
    if (!user.isVerified) {
      return res.status(400).json({ message: "Email is not verified" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;
    user.password = hashedPassword;
    await user.save();



    generateToken(user._id,"user", res);

    res.status(201).json({
      _id: user._id,
      fullName: user.name,
      email: user.email,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    if (email) {
      const user = await User.findOne({ email });
      if (user && user.isVerified) {
        user.isVerified = false;
        await user.save();
      }
    }
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, user.role ,res);

    res.status(200).json({
      _id: user._id,
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log("Error in logout:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    generateToken(user._id, res);
    res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;
    const message = `You requested a password reset. Please use the following link: ${resetUrl}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      text: message,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkAuth = (req, res) => {
  try {
    if (!req.user) {
      console.log("User not authenticated");
      return res.status(401).json({ message: "User not authenticated" });
    }
    console.log("Authenticated User:", req.user); // Log the authenticated user details
    res.status(200).json(req.user);
  } catch (e) {
    console.error("Error in checkAuth:", e); // Log the error in more detail
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Find all users with role 'user'
    const users = await User.find().select("-password");
    // Count users with role 'user'
    const totalUsers = await User.countDocuments({ role: "user" });
    console.log("Total users:", totalUsers, users);
    res.status(200).json({
      totalUsers,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phone, addPhone, address } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.addPhone = addPhone || user.addPhone;
    user.address = address || user.address;
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
   if(user && user.isVerified) {
    return res.status(409).json({ message: "Email already exists" });
  }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
   
    if (user) {
      user.otp = otp;
      user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();
    } else {
      const newUser = new User({
        email,
      });
      newUser.otp = otp;
      newUser.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
      await newUser.save();
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    try {
      await new Promise((resolve, reject) => {
        transporter.verify((error, success) => {
          if (error) {
            console.log("SMTP verification failed:", error);
            reject(error);
          } else {
            console.log("SMTP connection verified successfully");
            resolve(success);
          }
        });
      });
    } catch (verifyError) {
      // If verify fails, don't even try to send
      console.error("Failed to verify SMTP connection:", verifyError);
      return res.status(500).json({ message: "Email service unavailable" });
    }

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log("Verifying OTP for:", email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || Date.now() > user.otpExpire) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  checkAuth,
  getAllUsers,
  refreshToken,
  forgotPassword,
  verifyEmail,
  updateUser,
  sendOtp,
  verifyOtp,
};
