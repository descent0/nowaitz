const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String
        },
        status:{
            type:String,
            enum:['Approved','NotApproved','Rejected'],
            default:'NotApproved'
        },
    
},{
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;