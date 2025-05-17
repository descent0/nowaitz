const { default: mongoose, Schema } = require("mongoose");

const serviceShopSchema = new Schema({
  shopID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  operatingHours: {
    weekdays: {
      type: String,
      required: true
    },
    weekends: {
      type: String,
      required: true
    }
  },
  category: {
    type: String,
    required: true,
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    website: String
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Under Maintenance', 'NotApproved', 'Rejected'],
    default: 'NotApproved'
  },
  locationCoordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  emergencyContact: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ServiceShop = mongoose.model('ServiceShop', serviceShopSchema);
module.exports = ServiceShop;
