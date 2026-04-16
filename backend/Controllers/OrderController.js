// const Order = require('../Models/Order');
// const Cart = require('../Models/Cart');
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASS
//     }
// });

// const calculateShipping = (subtotal, city) => {
//     if (subtotal > 4500) return 0;

//     const normalizedCity = city?.trim().toLowerCase();

//     if (normalizedCity === "pokhara") return 150;

//     return 220;
// };

// const sendOrderConfirmation = async (userEmail, order) => {
//     const itemRows = order.items.map(item =>
//         `${item.name} x${item.quantity} — Rs. ${(item.price * item.quantity).toLocaleString()}`
//     ).join('\n');

//     await transporter.sendMail({
//         from: `"SkincareSync" <${process.env.GMAIL_USER}>`,
//         to: userEmail,
//         subject: `Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()}`,
//         text: `Hi there,

// Thank you for your order!

// Order ID: #${order._id.toString().slice(-8).toUpperCase()}

// ${itemRows}

// Subtotal: Rs. ${order.subtotal.toLocaleString()}
// Shipping: Rs. ${order.shipping}
// Total: Rs. ${order.totalAmount.toLocaleString()}

// Payment: Cash on Delivery
// Delivery to: ${order.deliveryAddress.address}, ${order.deliveryAddress.city}

// - SkincareSync`
//     });
// };

// const sendShippedEmail = async (userEmail, order) => {
//     await transporter.sendMail({
//         from: `"SkincareSync" <${process.env.GMAIL_USER}>`,
//         to: userEmail,
//         subject: `Your order is on its way — #${order._id.toString().slice(-8).toUpperCase()}`,
//         text: `Hi there,

// Your order is on its way.

// Order ID: #${order._id.toString().slice(-8).toUpperCase()}

// Delivery: ${order.deliveryAddress.address}, ${order.deliveryAddress.city}

// - SkincareSync`
//     });
// };

// const sendDeliveredEmail = async (userEmail, order) => {
//     const orderId = order._id.toString().slice(-8).toUpperCase();

//     await transporter.sendMail({
//         from: `"SkincareSync" <${process.env.GMAIL_USER}>`,
//         to: userEmail,
//         subject: `Delivered — #${orderId}`,
//         text: `Hi,

// Your order has been delivered.

// Order ID: #${orderId}

// - SkincareSync`
//     });
// };

// const placeOrder = async (req, res) => {
//     try {
//         const { userEmail, deliveryAddress, items, isBuyNow } = req.body;

//         if (!items || items.length === 0) {
//             return res.status(400).json({ success: false, message: "No items provided" });
//         }

//         const subtotal = items.reduce((sum, item) => {
//             return sum + item.price * item.quantity;
//         }, 0);

//         const shipping = calculateShipping(subtotal, deliveryAddress.city);

//         const totalAmount = subtotal + shipping;

//         const order = new Order({
//             userEmail,
//             items,
//             deliveryAddress,
//             subtotal,
//             shipping,
//             totalAmount,
//             paymentMethod: "Cash on Delivery"
//         });

//         await order.save();


//         const cart = await Cart.findOne({ userId: userEmail });

//         if (cart && !isBuyNow) {
//             const orderedProductIds = items.map(i => i.productId.toString());

//             const isFullCartCheckout =
//                 cart.items.length === orderedProductIds.length;

//             if (isFullCartCheckout) {
//                 cart.items = [];
//             } else {
//                 cart.items = cart.items.filter(
//                     item => !orderedProductIds.includes(item.productId.toString())
//                 );
//             }

//             await cart.save();
//         }

//         sendOrderConfirmation(userEmail, order)
//             .catch(err => console.error("Email error:", err));

//         res.status(201).json({
//             success: true,
//             message: "Order placed successfully",
//             order
//         });

//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// const getUserOrders = async (req, res) => {
//     try {
//         const { userEmail } = req.query;
//         const orders = await Order.find({ userEmail }).sort({ createdAt: -1 });
//         res.json({ success: true, orders });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// const getAllOrders = async (req, res) => {
//     try {
//         const orders = await Order.find().sort({ createdAt: -1 });
//         res.json({ success: true, orders });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// const updateOrderStatus = async (req, res) => {
//     try {
//         const { status } = req.body;

//         const order = await Order.findByIdAndUpdate(
//             req.params.id,
//             { status },
//             { new: true }
//         );

//         if (!order) {
//             return res.status(404).json({ success: false, message: "Order not found" });
//         }

//         if (status === "Shipped") {
//             sendShippedEmail(order.userEmail, order)
//                 .catch(err => console.error(err));
//         }

//         if (status === "Delivered") {
//             sendDeliveredEmail(order.userEmail, order)
//                 .catch(err => console.error(err));
//         }

//         res.json({ success: true, order });

//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// const cancelOrder = async (req, res) => {
//     try {
//         const order = await Order.findById(req.params.id);

//         if (!order) {
//             return res.status(404).json({ success: false });
//         }

//         if (!["Pending", "Processing"].includes(order.status)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Cannot cancel at this stage"
//             });
//         }

//         order.status = "Cancelled";
//         await order.save();

//         res.json({ success: true, order });

//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// const deleteOrder = async (req, res) => {
//     try {
//         await Order.findByIdAndDelete(req.params.id);
//         res.json({ success: true, message: "Order deleted" });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// module.exports = {placeOrder, getUserOrders, getAllOrders, updateOrderStatus, deleteOrder, cancelOrder};



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

const calculateShipping = (subtotal, city) => {
    if (subtotal > 4500) return 0;

    const normalizedCity = city?.trim().toLowerCase();

    if (normalizedCity === "pokhara") return 150;

    return 220;
};

const sendOrderConfirmation = async (userEmail, order) => {
    const itemRows = order.items.map(item =>
        `${item.name} x${item.quantity} — Rs. ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    await transporter.sendMail({
        from: `"SkincareSync" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: `Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()}`,
        text: `Hi there,

Thank you for your order!

Order ID: #${order._id.toString().slice(-8).toUpperCase()}

${itemRows}

Subtotal: Rs. ${order.subtotal.toLocaleString()}
Shipping: Rs. ${order.shipping}
Total: Rs. ${order.totalAmount.toLocaleString()}

Payment: Cash on Delivery
Delivery to: ${order.deliveryAddress.address}, ${order.deliveryAddress.city}

- SkincareSync`
    });
};

const sendShippedEmail = async (userEmail, order) => {
    await transporter.sendMail({
        from: `"SkincareSync" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: `Your order is on its way — #${order._id.toString().slice(-8).toUpperCase()}`,
        text: `Hi there,

Your order is on its way.

Order ID: #${order._id.toString().slice(-8).toUpperCase()}

Delivery: ${order.deliveryAddress.address}, ${order.deliveryAddress.city}

- SkincareSync`
    });
};

const sendDeliveredEmail = async (userEmail, order) => {
    const orderId = order._id.toString().slice(-8).toUpperCase();

    await transporter.sendMail({
        from: `"SkincareSync" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: `Delivered — #${orderId}`,
        text: `Hi,

Your order has been delivered.

Order ID: #${orderId}

- SkincareSync`
    });
};

const placeOrder = async (req, res) => {
    try {
        const { userEmail, deliveryAddress, items, isBuyNow } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No items provided" });
        }

        const subtotal = items.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        const shipping = calculateShipping(subtotal, deliveryAddress.city);
        const totalAmount = subtotal + shipping;

        const order = new Order({
            userEmail,
            items,
            deliveryAddress,
            subtotal,
            shipping,
            totalAmount,
            paymentMethod: "Cash on Delivery",
            paymentStatus: "Unpaid",
            status: "Pending"
        });

        await order.save();

        const cart = await Cart.findOne({ userId: userEmail });

        if (cart && !isBuyNow) {
            const orderedProductIds = items.map(i => i.productId.toString());

            const isFullCartCheckout =
                cart.items.length === orderedProductIds.length;

            if (isFullCartCheckout) {
                cart.items = [];
            } else {
                cart.items = cart.items.filter(
                    item => !orderedProductIds.includes(item.productId.toString())
                );
            }

            await cart.save();
        }

        sendOrderConfirmation(userEmail, order)
            .catch(err => console.error("Email error:", err));

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

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

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const updateData = {
            status
        };

        if (status === "Delivered" && order.paymentMethod === "Cash on Delivery") {
            updateData.paymentStatus = "Paid";
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (status === "Shipped") {
            sendShippedEmail(updatedOrder.userEmail, updatedOrder)
                .catch(err => console.error("Shipped email error:", err));
        }

        if (status === "Delivered") {
            sendDeliveredEmail(updatedOrder.userEmail, updatedOrder)
                .catch(err => console.error("Delivered email error:", err));
        }

        return res.json({
            success: true,
            order: updatedOrder
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false });
        }

        if (!["Pending", "Processing"].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel at this stage"
            });
        }

        order.status = "Cancelled";
        await order.save();

        res.json({ success: true, order });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Order deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {placeOrder, getUserOrders, getAllOrders, updateOrderStatus, deleteOrder, cancelOrder};