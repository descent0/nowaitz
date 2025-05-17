const express = require('express');
const { registerShop, loginShop, updateShopInfo, updateShopPassword, checkShop, getAllShopsByCategory, getShopByShopID, getAllShops, approveShop, updateShopStatus, getShopById, logoutShop } = require('../controller/shop.controller');
const { protect } = require('../middleware/protect');
const { protectShop } = require('../middleware/protectShop');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log('File field name:', file.fieldname); // Add logging
    if (file.fieldname === 'images') {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
    }
  }
});

const ShopRouter = express.Router();

ShopRouter.post('/register', upload.array('images', 10), registerShop);

ShopRouter.post('/login', loginShop);
ShopRouter.post('/logout',logoutShop)

ShopRouter.get('/allShop', getAllShops);
ShopRouter.put('/update',  updateShopInfo);
ShopRouter.get("/checkShop", protectShop, checkShop);


ShopRouter.put('/update-password', protectShop, updateShopPassword);
ShopRouter.put("/status/:shop_id", updateShopStatus);

ShopRouter.get('/shop/:category', getAllShopsByCategory);
ShopRouter.get('/:shopID', getShopByShopID);
ShopRouter.get('/shop/:id', getShopById);

module.exports = ShopRouter;
