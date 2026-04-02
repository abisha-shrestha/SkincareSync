// const Cart = require("../Models/Cart");
// const Product = require("../Models/Product");

// const addToCart = async (req, res) => {
//     try {
//         const { userEmail, productId, quantity } = req.body;

//         const product = await Product.findById(productId);

//         if (!product) {
//         return res.status(404).json({   
//             success: false,
//             message: "Product not found",
//         });
//         }

//         let cart = await Cart.findOne({ userId: userEmail });

//         if (!cart) {
//         cart = new Cart({
//             userId: userEmail,
//             items: [],
//         });
//         }

//         const existingItemIndex = cart.items.findIndex(
//         (item) => item.productId.toString() === productId
//         );

//         // DELETE ITEM
//         if (quantity === 0) {
//         cart.items = cart.items.filter(
//             (item) => item.productId.toString() !== productId
//         );
//         }

//         // UPDATE ITEM
//         else if (existingItemIndex > -1) {
//             cart.items[existingItemIndex].quantity += quantity;
//         }

//         // ADD NEW ITEM
//         else {
//         cart.items.push({
//             productId,
//             quantity,
//             price: product.price,
//             name: product.name,
//         });
//         }

//         await cart.save();

//         res.json({
//         success: true,
//         message: "Cart updated",
//         cart,
//         });
//     } catch (err) {
//         res.status(500).json({
//         success: false,
//         message: err.message,
//         });
//     }
//     };

//     const getCart = async (req, res) => {
//     try {
//         const { userEmail } = req.query;

//         const cart = await Cart.findOne({ userId: userEmail }).populate(
//         "items.productId"
//         );

//         res.json({
//         success: true,
//         cart: cart || { items: [] },
//         });
//     } catch (err) {
//         res.status(500).json({
//         success: false,
//         message: err.message,
//         });
//     }
//     };

//     module.exports = {
//     addToCart,
//     getCart,
// };



const Cart = require("../Models/Cart");
const Product = require("../Models/Product");

const addToCart = async (req, res) => {
    try {
        const { userEmail, productId, quantity, addToExisting } = req.body;

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
            if (addToExisting) {
                // From "Add to Cart" button — accumulate on top of existing
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // From cart +/- buttons — set the exact value
                cart.items[existingItemIndex].quantity = quantity;
            }
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