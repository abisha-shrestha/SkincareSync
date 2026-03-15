const UserModel = require('../Models/User');
const Product = require('../Models/Product');
const Cart = require('../Models/Cart');
const Wishlist = require('../Models/Wishlist');
const Order = require('../Models/Order');

const getStats = async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments({ role: { $ne: 'admin' } });
        const totalProducts = await Product.countDocuments();
        const totalCarts = await Cart.countDocuments();
        const totalWishlists = await Wishlist.countDocuments();
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });

        res.json({
            success: true,
            stats: { totalUsers, totalProducts, totalCarts, totalWishlists, totalOrders, pendingOrders }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find({ role: { $ne: 'admin' } }).select('-password');
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getStats, getUsers, deleteUser, getProducts, createProduct, updateProduct, deleteProduct };