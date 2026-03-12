const router = require('express').Router();
const { addToCart, getCart } = require('../Controllers/CartController');

router.post('/', addToCart);
router.get('/', getCart);

module.exports = router;
