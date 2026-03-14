const Wishlist = require('../Models/Wishlist');
const Product = require('../Models/Product');

const toggleWishlist = async (req, res) => {
    try {
        const { userEmail, productId } = req.body;

        let wishlist = await Wishlist.findOne({ userId: userEmail });

        if (!wishlist) {
            wishlist = new Wishlist({ userId: userEmail, items: [] });
        }

        const exists = wishlist.items.includes(productId);

        if (exists) {
            wishlist.items = wishlist.items.filter(id => id.toString() !== productId);
        } else {
            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
            wishlist.items.push(productId);
        }

        await wishlist.save();

        res.json({ success: true, wishlisted: !exists, wishlist });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getWishlist = async (req, res) => {
    try {
        const { userEmail } = req.query;
        const wishlist = await Wishlist.findOne({ userId: userEmail }).populate('items');
        res.json({ success: true, wishlist: wishlist || { items: [] } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { toggleWishlist, getWishlist };