
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceShop', 
        required: true
      },
    name: {
        type: String,
        required: true,  
        unique: true,   
    },
    description: {
        type: String,
        required: true,  
    },
    price: {
        type: Number,
        required: true,  
        min: [0, 'Price cannot be negative'],  
    },
    duration: {
        type: Number,
        required: true,  
        min: [1, 'Duration should be at least 1 minute'],  
    },
    createdAt: {
        type: Date,
        default: Date.now,  
    },
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;