const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
}, { timestamps: true });

ReviewSchema.index({ productId: 1, userEmail: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);