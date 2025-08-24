
const mongoose = require('mongoose');

const WarrantySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    productName: {
        type: String,
        required: true,
    },
    storeName: {
        type: String,
        required: true,
    },
    purchaseDate: {
        type: Date,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    purchasePrice: {
        type: Number,
    },
    serialNumber: {
        type: String,
    },
    description: {
        type: String,
    },
    notes: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Warranty', WarrantySchema);
