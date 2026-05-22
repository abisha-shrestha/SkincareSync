const Order = require('../Models/Order');
const Cart = require('../Models/Cart');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


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
        `${item.name} x${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    await transporter.sendMail({
        from: `"SkincareSync" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: `Order Confirmed - #${order._id.toString().slice(-8).toUpperCase()}`,
        text: `Hi there,

Thank you for your order! Here's your summary:

Order ID: #${order._id.toString().slice(-8).toUpperCase()}

${itemRows}
Shipping charge - Rs. ${order.shipping}

Total: Rs. ${order.totalAmount.toLocaleString()}

Payment: ${order.paymentMethod}
Delivery to: ${order.deliveryAddress.address}, ${order.deliveryAddress.city}

We'll notify you once your order is on its way.

- SkincareSync`
    });
};

const sendShippedEmail = async (userEmail, order) => {
    await transporter.sendMail({
        from: `"SkincareSync" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: `Your order is on its way - #${order._id.toString().slice(-8).toUpperCase()}`,
        text: `Hi there,

Your order is on its way.

Order ID: #${order._id.toString().slice(-8).toUpperCase()}

Delivery: ${order.deliveryAddress.address}, ${order.deliveryAddress.city}

- SkincareSync`
    });
};

const sendDeliveredEmail = async (userEmail, order) => {
    const orderId = order._id.toString().slice(-8).toUpperCase();

    const reviewLinks = order.items.map(item =>
        `${item.name}: ${process.env.FRONTEND_URL}/review?productId=${item.productId}&orderId=${order._id}`
    ).join('\n');

    await transporter.sendMail({
        from: `"SkincareSync" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: `Delivered - #${orderId}`,
        text: `Hi there,

Your order has been delivered.

Order ID: #${orderId}

We hope you're satisfied with your purchase. If you have a moment, share your feedback:

${reviewLinks}

If there's any issue with your order, feel free to contact us at ${process.env.GMAIL_USER}.

Thank you for shopping with us.

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



const generateEsewaSignature = (totalAmount, transactionUuid) => {
    const normalized = parseFloat(String(totalAmount).replace(/,/g, ''));
    const data = `total_amount=${normalized},transaction_uuid=${transactionUuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;
    return crypto
        .createHmac('sha256', process.env.ESEWA_SECRET_KEY)
        .update(data)
        .digest('base64');
};

// Initiate eSewa payment 
const initiateEsewaPayment = async (req, res) => {
    try {
        const { userEmail, deliveryAddress, items, isBuyNow } = req.body;

        if (!items || items.length === 0)
            return res.status(400).json({ success: false, message: "No items provided" });

        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = calculateShipping(subtotal, deliveryAddress.city);
        const totalAmount = subtotal + shipping;

        const transactionUuid = `SSO-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const signature = generateEsewaSignature(totalAmount, transactionUuid);

        // Only save after verified
        res.json({
            success: true,
            esewaPayload: {
                amount: subtotal,
                tax_amount: 0,
                total_amount: totalAmount,
                transaction_uuid: transactionUuid,
                product_code: process.env.ESEWA_PRODUCT_CODE,
                product_service_charge: 0,
                product_delivery_charge: shipping,
                success_url: `${process.env.FRONTEND_URL}/esewa-success`,
                failure_url: `${process.env.FRONTEND_URL}/esewa-failure`,
                signed_field_names: 'total_amount,transaction_uuid,product_code',
                signature
            },
            // Pass order data through so frontend can store it in sessionStorage
            pendingOrder: {
                userEmail,
                deliveryAddress,
                items,
                isBuyNow,
                subtotal,
                shipping,
                totalAmount,
                transactionUuid
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Verify eSewa payment after redirect
const verifyEsewaPayment = async (req, res) => {
    try {
        const { data } = req.query;

        if (!data) return res.status(400).json({ success: false, message: "No data received" });

        const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
        const { transaction_uuid, total_amount, status, signature } = decoded;

        //  TEMP DEBUG
        // console.log("eSewa decoded response:", decoded);
        // console.log("total_amount raw value:", total_amount);
        // console.log("total_amount type:", typeof total_amount);
        // console.log("transaction_uuid:", transaction_uuid);

        if (status !== 'COMPLETE') {
            return res.status(400).json({ success: false, message: "Payment not complete" });
        }

        const fieldNames = decoded.signed_field_names.split(',');
        const signatureData = fieldNames.map(field => `${field}=${decoded[field]}`).join(',');

        const expectedSig = crypto
            .createHmac('sha256', process.env.ESEWA_SECRET_KEY)
            .update(signatureData)
            .digest('base64');

        if (expectedSig !== signature) {
            return res.status(400).json({ success: false, message: "Signature mismatch" });
        }
        const { pendingOrder } = req.body;

        if (!pendingOrder) {
            return res.status(400).json({ success: false, message: "Missing order data" });
        }

        if (pendingOrder.transactionUuid !== transaction_uuid) {
            return res.status(400).json({ success: false, message: "Transaction UUID mismatch" });
        }

        const order = new Order({
            userEmail: pendingOrder.userEmail,
            items: pendingOrder.items,
            deliveryAddress: pendingOrder.deliveryAddress,
            subtotal: pendingOrder.subtotal,
            shipping: pendingOrder.shipping,
            totalAmount: pendingOrder.totalAmount,
            paymentMethod: 'eSewa',
            paymentStatus: 'Paid',
            status: 'Processing',
            esewaTransactionUuid: transaction_uuid
        });

        await order.save();

        if (!pendingOrder.isBuyNow) {
            const cart = await Cart.findOne({ userId: pendingOrder.userEmail });
            if (cart) {
                const orderedIds = pendingOrder.items.map(i =>
                    (i.productId?._id || i.productId).toString()
                );
                cart.items = cart.items.filter(
                    item => !orderedIds.includes(item.productId.toString())
                );
                await cart.save();
            }
        }

        sendOrderConfirmation(pendingOrder.userEmail, order).catch(console.error);

        res.json({ success: true, order });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


const demoPayment = async (req, res) => {

    if (process.env.NODE_ENV === "production") {
        return res.status(403).json({
            success: false,
            message: "Demo payment is not available in production"
        });
    }

    try {
        const { outcome, userEmail, deliveryAddress, items, isBuyNow } = req.body;

        if (!["success", "failure"].includes(outcome)) {
            return res.status(400).json({ success: false, message: "Invalid outcome" });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No items provided" });
        }

        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = calculateShipping(subtotal, deliveryAddress?.city);
        const totalAmount = subtotal + shipping;

        if (outcome === "failure") {
            return res.json({
                success: true,
                outcome: "failure",
                message: "Demo payment failed"
            });
        }

        const order = new Order({
            userEmail,
            items,
            deliveryAddress,
            subtotal,
            shipping,
            totalAmount,
            paymentMethod: "eSewa",
            paymentStatus: "Paid",
            status: "Processing",
            esewaTransactionUuid: `DEMO-${Date.now()}`
        });

        await order.save();

        if (!isBuyNow) {
            const cart = await Cart.findOne({ userId: userEmail });
            if (cart) {
                const orderedIds = items.map(i =>
                    (i.productId?._id || i.productId).toString()
                );
                cart.items = cart.items.filter(
                    item => !orderedIds.includes(item.productId.toString())
                );
                await cart.save();
            }
        }

        sendOrderConfirmation(userEmail, order).catch(console.error);

        return res.json({ success: true, outcome: "success", order });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};


module.exports = { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, deleteOrder, cancelOrder, initiateEsewaPayment, verifyEsewaPayment, demoPayment };

