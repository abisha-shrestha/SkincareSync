const mongoose = require('mongoose');

const DiaryEntrySchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    date: { type: String, required: true },
    condition: { type: Number, min: 1, max: 5, required: true },
    products: { type: String, default: '' },
    notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('DiaryEntry', DiaryEntrySchema);