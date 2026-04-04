const Order = require('../Models/Order');
const Cart = require('../Models/Cart');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

const sendOrderConfirmation = async (userEmail, order) => {
    const itemRows = order.items.map(item =>
        `${item.name} x${item.quantity} — Rs. ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    await transporter.sendMail({
        from: `"SkincareSync" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: `Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()}`,
        text: `Hi there,\n\nThank you for your order! Here's your summary:\n\nOrder ID: #${order._id.toString().slice(-8).toUpperCase()}\n\n${itemRows}\n\nTotal: Rs. ${order.totalAmount.toLocaleString()}\nPayment: Cash on Delivery\nDelivery to: ${order.deliveryAddress.address}, ${order.deliveryAddress.city}\n\nWe'll notify you once your order is on its way.\n\n- SkincareSync`
    });
};

const sendShippedEmail = async (userEmail, order) => {
    await transporter.sendMail({
        from: `"SkincareSync" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: `Your order is on its way — #${order._id.toString().slice(-8).toUpperCase()}`,
        text: `Hi there,\n\nYour order is on its way.\n\nOrder ID: #${order._id.toString().slice(-8).toUpperCase()}\n\nIt has been shipped and will be delivered to: ${order.deliveryAddress.address}, ${order.deliveryAddress.city}\n\nWe'll notify you once it has been delivered.\n\n- SkincareSync`
    });
};

const sendDeliveredEmail = async (userEmail, order) => {
    const orderId = order._id.toString().slice(-8).toUpperCase();
    const reviewLink = `http://localhost:3001/product/${order.items[0]?.productId}`;

    await transporter.sendMail({
        from: `"SkincareSync" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: `Your order has been delivered — #${orderId}`,
        text: `Hi there,\n\nYour order has been delivered.\n\nOrder ID: #${orderId}\n\nWe hope you're satisfied with your purchase. If you have a moment, you can share your feedback with us:\n${reviewLink}\n\nIf there is any issue with your order, feel free to contact us at skincaresync111@gmail.com.\n\nThank you for shopping with us.\n\n- SkincareSync`
    });
};


const placeOrder = async (req, res) => {
    try {
        const { userEmail, deliveryAddress, items: incomingItems, isBuyNow } = req.body;

        let items;

        if (isBuyNow) {
            if (!incomingItems || incomingItems.length === 0) {
                return res.status(400).json({ success: false, message: 'No items provided' });
            }
            items = incomingItems;

        } else if (incomingItems && incomingItems.length > 0) {
            items = incomingItems;

            // Only remove the ordered items from the cart, leave the rest
            const cart = await Cart.findOne({ userId: userEmail });
            if (cart) {
                const orderedProductIds = incomingItems.map(i => i.productId.toString());
                cart.items = cart.items.filter(
                    item => !orderedProductIds.includes(item.productId.toString())
                );
                await cart.save();
            }

        } else {
            const cart = await Cart.findOne({ userId: userEmail }).populate('items.productId');
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ success: false, message: 'Cart is empty' });
            }
            items = cart.items.map(item => ({
                productId: item.productId._id,
                name: item.productId.name,
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.productId.imageUrl || ''
            }));
            cart.items = [];
            await cart.save();
        }

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = new Order({
            userEmail,
            items,
            deliveryAddress,
            totalAmount,
            paymentMethod: 'Cash on Delivery'
        });

        await order.save();

        sendOrderConfirmation(userEmail, order).catch(err => console.error('Email failed:', err));

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

        if (status === 'Shipped') {
            sendShippedEmail(order.userEmail, order).catch(err => console.error('Shipped email failed:', err));
        } else if (status === 'Delivered') {
            sendDeliveredEmail(order.userEmail, order).catch(err => console.error('Delivered email failed:', err));
        }

        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (!['Pending', 'Processing'].includes(order.status)) {
            return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
        }

        order.status = 'Cancelled';
        await order.save();

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

module.exports = { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, deleteOrder, cancelOrder };