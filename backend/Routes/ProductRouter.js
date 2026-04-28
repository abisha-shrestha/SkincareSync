const router = require('express').Router();
const Product = require('../Models/Product');
const { getProducts, getProduct, getRoutine } = require('../Controllers/ProductController');

// Get all products
router.get('/', getProducts);

// Get recommended routine
router.get('/routine', getRoutine);

// Get single product
router.get('/:id', getProduct);

// Seed data
router.post('/seed', async (req, res) => {
    try {
        await Product.deleteMany({});
        await Product.insertMany([
            {
                name: "Hydrating Essence",
                brand: "SkincareSync",
                price: 4500,
                category: "Hydration",
                description: "Hydrating skincare product",
                skinTypes: ["Normal", "Dry"],
                imageUrl: "/api/products/1"
            },
            {
                name: "Restorative Serum",
                brand: "SkincareSync",
                price: 5200,
                category: "Repair",
                description: "Skin repair serum",
                skinTypes: ["All"],
                imageUrl: "/api/products/2"
            },
            {
                name: "Night Recovery Cream",
                brand: "SkincareSync",
                price: 7000,
                category: "Repair",
                description: "Night recovery treatment",
                skinTypes: ["Dry"],
                imageUrl: "/api/products/3"
            }
        ]);
        res.json({ success: true, message: "Products seeded!" });
    } catch (err) {
        console.error("SEED ERROR:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
