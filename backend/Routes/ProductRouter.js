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
                price: 4000, 
                category: "Hydration", 
                skinTypes: ["Normal", "Dry"],
                imageUrl: "/api/products/1/image"
            },
            { 
                name: "Restorative Serum", 
                price: 5200, 
                category: "Repair", 
                skinTypes: ["All"]
            },
            { 
                name: "Night Recovery Cream", 
                price: 7000, 
                category: "Repair", 
                skinTypes: ["Dry"]
            },
            { 
                name: "Purifying Cleanser", 
                price: 3500, 
                category: "Cleanser", 
                skinTypes: ["Oily"]
            },
            { 
                name: "Balancing Toner", 
                price: 3500, 
                category: "Toner", 
                skinTypes: ["Combination"]
            },
            { 
                name: "Daily Glow Moisturizer", 
                price: 4500, 
                category: "Hydration", 
                skinTypes: ["Normal"]
            }
        ]);
        res.json({ success: true, message: "Products seeded!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Seed error" });
    }
});

module.exports = router;
