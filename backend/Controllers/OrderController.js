const Order = require('../Models/Order');
const Cart = require('../Models/Cart');

const placeOrder = async (req, res) => {
    try {
        const { userEmail, deliveryAddress } = req.body;

        // Get cart
        const cart = await Cart.findOne({ userId: userEmail }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Build order items
        const items = cart.items.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.productId.imageUrl || ''
        }));

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Create order
        const order = new Order({
            userEmail,
            items,
            deliveryAddress,
            totalAmount,
            paymentMethod: 'Cash on Delivery'
        });

        await order.save();

        // Clear cart after order
        cart.items = [];
        await cart.save();

        res.status(201).json({ success: true, message: 'Order placed successfully', order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const { userEmail } = req.query;
        const orders = await Order.find({ userEmail }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, deleteOrder };