const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },

    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: String,
            price: Number,
            quantity: Number,
            imageUrl: String
        }
    ],

    deliveryAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String
    },

    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    totalAmount: Number,

    paymentMethod: { type: String, default: 'Cash on Delivery' },

    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Paid', 'Failed', 'Refunded'],
        default: 'Unpaid'
    },

    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
