const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: Number,
    category: String,
    description: String,
    skinTypes: [String],
    imageUrl: String,
    stock: { type: Number, default: 100 }
});

module.exports = mongoose.model('Product', productSchema);