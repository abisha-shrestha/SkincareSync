const Review = require('../Models/Review');
const Order = require('../Models/Order');
const Product = require('../Models/Product');


const recalculateRating = async (productId) => {
    const reviews = await Review.find({ productId });
    const avg = reviews.length
        ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
        : 0;
    await Product.findByIdAndUpdate(productId, { averageRating: avg });
    return avg;
};

const getReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
        const avg = reviews.length
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : null;
        res.json({ success: true, reviews, average: avg, total: reviews.length });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const addReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { userEmail, userName, rating, comment } = req.body;

        const hasBought = await Order.findOne({
            userEmail,
            'items.productId': productId,
            status: { $in: ['Delivered'] }
        });
        if (!hasBought) {
            return res.status(403).json({ success: false, message: 'Only buyers can review this product' });
        }

        const review = await Review.create({ productId, userEmail, userName, rating, comment });

        // Recalculate after adding
        await recalculateRating(productId);

        res.status(201).json({ success: true, review });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { userEmail, rating, comment } = req.body;

        const review = await Review.findOneAndUpdate(
            { productId, userEmail },
            { rating, comment },
            { new: true }
        );
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

        // Recalculate after editing
        await recalculateRating(productId);

        res.json({ success: true, review });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { userEmail } = req.body;

        await Review.findOneAndDelete({ productId, userEmail });

        // Recalculate after deleting
        await recalculateRating(productId);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getReviews, addReview, updateReview, deleteReview };