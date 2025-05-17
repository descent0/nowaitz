const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;  // Corrected to req.cookies.jwt

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // JWT verification

    // Find the user by decoded userId and exclude password
    const user = await User.findById(decoded.Id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;  // Attach user to request
    next();  // Proceed to next middleware or route handler
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  protect,
};
