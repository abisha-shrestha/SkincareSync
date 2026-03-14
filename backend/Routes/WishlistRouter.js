const router = require('express').Router();
const { toggleWishlist, getWishlist } = require('../Controllers/WishlistController');

router.post('/', toggleWishlist);
router.get('/', getWishlist);

module.exports = router;