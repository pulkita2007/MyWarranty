
const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    billNumber: {
        type: String,
        required: true,
    },
    storeName: {
        type: String,
        required: true,
    },
    billDate: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    paymentMethod: {
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

module.exports = mongoose.model('Bill', BillSchema);
