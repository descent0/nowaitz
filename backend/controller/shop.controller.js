const bcrypt = require("bcryptjs");
const { generateToken } = require("../lib/jwtgen");
const ServiceShop = require("../model/shop.model");
const { createCategory } = require("../lib/createCategory");
const Category = require("../model/category.model");



// Register a New Shop
const registerShop = async (req, res) => {
  try {
    console.log("Raw request body:", req.body);
    console.log("Files received:", req.files);

    // Extract data from form fields
    const shopData = {
      name: req.body.name,
      location: req.body.location,
      category: req.body.category,
      password: req.body.password,
      contact: req.body.contact ? JSON.parse(req.body.contact) : undefined,
      operatingHours: req.body.operatingHours ? JSON.parse(req.body.operatingHours) : undefined,
      locationCoordinates: req.body.locationCoordinates ? JSON.parse(req.body.locationCoordinates) : undefined,
      socialMedia: req.body.socialMedia ? JSON.parse(req.body.socialMedia) : undefined,
      emergencyContact: req.body.emergencyContact
    };

    console.log("Parsed shop data:", shopData);

    // Validate data
    if (!shopData.name || !shopData.location || !shopData.category || !shopData.password) {
      return res.status(400).json({
        message: "Missing required fields",
        details: "Basic fields are required"
      });
    }

    if (!shopData.contact || !shopData.contact.phone || !shopData.contact.email) {
      return res.status(400).json({
        message: "Missing contact information",
        details: "Phone and email are required"
      });
    }

    if (!shopData.operatingHours || !shopData.operatingHours.weekdays || !shopData.operatingHours.weekends) {
      return res.status(400).json({
        message: "Missing operating hours",
        details: "Weekday and weekend hours are required"
      });
    }

    if (!shopData.locationCoordinates || !shopData.locationCoordinates.latitude || !shopData.locationCoordinates.longitude) {
      return res.status(400).json({
        message: "Missing location coordinates",
        details: "Latitude and longitude are required"
      });
    }

    // Process images
    const images = req.files ? req.files.map(file => file.path) : [];

    // Create shop
    const shopID = `SHOP-${Date.now()}`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(shopData.password, salt);

    const newShop = new ServiceShop({
      ...shopData,
      shopID,
      images,
      password: hashedPassword
    });

    const category = await Category.findOne({ name: shopData.category });
    if (!category) {
      await createCategory(shopData.category);
    }
    
    await newShop.save();
    res.status(201).json({
      message: "Shop registered successfully",
      shop: {
        ...newShop.toObject(),
        password: undefined // Remove password from response
      }
    });


  } catch (err) {
    console.error("Error registering shop:", err);
    res.status(500).json({
      message: "Error registering shop",
      error: err.message,
      details: err.errors ? Object.keys(err.errors).map(key => ({
        field: key,
        message: err.errors[key].message
      })) : undefined
    });
  }
};






// Shop Login
const loginShop = async (req, res) => {
  const { shopID, password } = req.body;
  console.log(req.body);
  console.log(shopID);
  try {
    const shop = await ServiceShop.findOne({ shopID });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found." });
    }
    console.log(shop);
    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    generateToken(shop._id,"shop", res);
    res.status(200).json({ message: "Shop logged in successfully", shop });
  } catch (err) {
    console.error(err); // Log the actual error
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

//shop logout 
const logoutShop = async (req, res) => {
  try {
      res.cookie("jwt", "", {
          expires: new Date(0), 
          httpOnly: true,       
          secure: process.env.NODE_ENV === 'production',  
          sameSite: 'Strict'   
      });
      res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
      console.log("Error in logout:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Shop Details
const updateShopInfo = async (req, res) => {
  const {
    shopID, // Add shopID from request body or query
    name,
    location,
    contact,
    operatingHours,
    category,
    socialMedia,
    images,
    status,
    locationCoordinates,
    emergencyContact,
  } = req.body;

  if (!shopID || !name || !location || !contact || !operatingHours || !category || !locationCoordinates) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const updatedShop = await ServiceShop.findOneAndUpdate(
      { shopID }, // Use shopID instead of req.shopId
      {
        name,
        location,
        contact,
        operatingHours,
        category,
        socialMedia,
        images,
        status,
        locationCoordinates,
        emergencyContact,
      },
      { new: true }
    );

    if (!updatedShop) {
      return res.status(404).json({ message: "Shop not found." });
    }

    res.status(200).json({ message: "Shop details updated successfully", updatedShop });
  } catch (err) {
    res.status(500).json({ message: "Error updating shop details", error: err.message });
  }
};

// Change Shop Password
const updateShopPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Old and new passwords are required." });
  }

  try {
    const shop = await ServiceShop.findById(req.shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, shop.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    shop.password = hashedPassword;
    await shop.save();

    res.status(200).json({ message: "Shop password updated successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating password", error: err.message });
  }
};

const checkShop = (req, res) => {
  try {
    if (!req.shop) {
      console.log("Shop not authenticated");
      return res.status(401).json({ message: "Shop not authenticated" });
    }
    console.log("Shop:", req.shop); // Log the authenticated user details
    res.status(200).json(req.shop);
  } catch (e) {
    console.error("Error in checkShop:", e); // Log the error in more detail
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllShopsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const shops = await ServiceShop.find({ status: "Active", category });

    if (!shops || shops.length === 0) {
      return res
        .status(404)
        .json({ message: "No shops found for this category" });
    }

    res.status(200).json(shops);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching shops", error: err.message });
  }
};

const getShopByShopID = async (req, res) => {
  try {
    const { shopID } = req.params; 
    console.log(shopID);
    const shop = await ServiceShop.find({shopID});
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    console.log(shop);
    res.status(200).json(shop);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching shop", error: err.message });
  }
};

const getShopById = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await ServiceShop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.status(200).json(shop);
  } catch (err) {
    res.status(500).json({ message: "Error fetching shop", error: err.message });
  }
};

const getAllShops=async(req,res)=>{
  try{
    const shops=await ServiceShop.find();
    if(!shops || shops.length===0){
      return res.status(404).json({message:"No shops found"});
    }
    res.status(200).json(shops);
  }catch(err){
    res.status(500).json({message:"Error fetching shops",error:err.message});
  }
}

const updateShopStatus = async (req, res) => {
  try {
    const { shop_id } = req.params;
    const { status } = req.body;
    console.log("Received shop_id:", shop_id, "with status:", status);

    const shop = await ServiceShop.findByIdAndUpdate(
      shop_id, // Use _id instead of shopID
      { status },
      { new: true }
    );

    console.log("Updated shop:", shop);

    if (!shop) {
      console.log("Shop not found with shop_id:", shop_id);
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json(shop);
  } catch (err) {
    console.error("Error updating shop status:", err);
    res.status(500).json({ message: "Error updating shop status", error: err.message });
  }
};

module.exports = {
  registerShop,
  loginShop,
  logoutShop,
  updateShopInfo,
  updateShopPassword,
  checkShop,
  getAllShopsByCategory,
  getShopByShopID,
  getShopById,
  getAllShops,
  updateShopStatus
};
