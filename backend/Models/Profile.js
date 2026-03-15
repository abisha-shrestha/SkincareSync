const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userEmail: { type: String, required: true, unique: true },
    fullName: { type: String, default: '' },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    birthdate: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);