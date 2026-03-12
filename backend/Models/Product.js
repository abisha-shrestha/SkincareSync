const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    skinTypes: [String],
    imageUrl: String,
    stock: { type: Number, default: 100 }
});

module.exports = mongoose.model('Product', productSchema);
