const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    label: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);