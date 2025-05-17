const jwt = require('jsonwebtoken');
const ServiceShop = require('../model/shop.model');


const protectShop = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No Token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    console.log(decoded);

    const shop = await ServiceShop.findById(decoded.Id).select('-password');

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    req.shop = shop;  
    next();  
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    console.error('JWT Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  protectShop,
};
