const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    price: Number
});

const cartSchema = new mongoose.Schema({
    userId: String,  // email for now
    items: [cartItemSchema]
});

module.exports = mongoose.model('Cart', cartSchema);
