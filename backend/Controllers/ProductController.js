const Product = require('../Models/Product');

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get single product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const getRoutine = async (req, res) => {
    try {
        const { skinType } = req.query;
        const steps = ['Cleanser', 'Toner', 'Moisturizer', 'Sunscreen'];

        const routine = await Promise.all(
            steps.map(category =>
                Product.findOne({
                    category,
                    skinTypes: { $regex: new RegExp(`^${skinType}$`, 'i') }
                })
            )
        );
        res.json({ success: true, routine });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getProducts, getProduct, getRoutine };


// const steps = ['Cleanser', 'Toner', 'Moisturizer', 'Sunscreen'];