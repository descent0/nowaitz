const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const protect = (...allowedRoles) => async (req, res, next) => {
  try {
    const token = req.cookies.jwt; 
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token" });
    }
   console.log(allowedRoles);
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

  
    const user = await User.findById(decoded.Id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
     
    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
  
    req.user = user;  
    next();  
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  protect,
};
