// const Cart = require('../Models/Cart');
// const Product = require('../Models/Product');  // ADD THIS LINE

// // Add to cart
// const addToCart = async (req, res) => {
//     try {
//         const { userEmail, productId, quantity, price } = req.body;
        
//         // Get product name from Product collection
//         const product = await Product.findById(productId);
        
//         let cart = await Cart.findOne({ userId: userEmail });
//         if (!cart) {
//             cart = new Cart({ userId: userEmail, items: [] });
//         }
        
//         const existingItem = cart.items.find(item => item.productId == productId);
//         if (existingItem) {
//             existingItem.quantity += quantity;
//         } else {
//             cart.items.push({ 
//                 productId, 
//                 quantity, 
//                 price,
//                 name: product.name  // SHOW PRODUCT NAME IN CART
//             });
//         }
        
//         await cart.save();
//         res.json({ success: true, message: "Added to cart!" });
//     } catch (err) {
//         res.status(500).json({ success: false, message: "Cart error" });
//     }
// };

// // Get cart
// const getCart = async (req, res) => {
//     try {
//         const { userEmail } = req.query;
//         const cart = await Cart.findOne({ userId: userEmail });
//         res.json({ success: true, cart: cart || { items: [] } });
//     } catch (err) {
//         res.status(500).json({ success: false, message: "Cart error" });
//     }
// };

// module.exports = { addToCart, getCart };







const Cart = require("../Models/Cart");
const Product = require("../Models/Product");

const addToCart = async (req, res) => {
    try {
        const { userEmail, productId, quantity } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
        return res.status(404).json({   
            success: false,
            message: "Product not found",
        });
        }

        let cart = await Cart.findOne({ userId: userEmail });

        if (!cart) {
        cart = new Cart({
            userId: userEmail,
            items: [],
        });
        }

        const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
        );

        // DELETE ITEM
        if (quantity === 0) {
        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId
        );
        }

        // UPDATE ITEM
        else if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity = quantity;
        }

        // ADD NEW ITEM
        else {
        cart.items.push({
            productId,
            quantity,
            price: product.price,
            name: product.name,
        });
        }

        await cart.save();

        res.json({
        success: true,
        message: "Cart updated",
        cart,
        });
    } catch (err) {
        res.status(500).json({
        success: false,
        message: err.message,
        });
    }
    };

    const getCart = async (req, res) => {
    try {
        const { userEmail } = req.query;

        const cart = await Cart.findOne({ userId: userEmail }).populate(
        "items.productId"
        );

        res.json({
        success: true,
        cart: cart || { items: [] },
        });
    } catch (err) {
        res.status(500).json({
        success: false,
        message: err.message,
        });
    }
    };

    module.exports = {
    addToCart,
    getCart,
};