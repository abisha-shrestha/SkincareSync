const router = require('express').Router();
const { getReviews, addReview, updateReview, deleteReview } = require('../Controllers/ReviewController');

router.get('/:productId', getReviews);
router.post('/:productId', addReview);
router.put('/:productId', updateReview);
router.delete('/:productId', deleteReview);

module.exports = router;