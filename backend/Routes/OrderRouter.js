const router = require('express').Router();
const {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
} = require('../Controllers/OrderController');
const adminOnly = require('../Middlewares/AdminMiddleware');

router.post('/', placeOrder);
router.get('/', getUserOrders);
router.get('/all', adminOnly, getAllOrders);
router.put('/:id/status', adminOnly, updateOrderStatus);
router.delete('/:id', adminOnly, deleteOrder);

module.exports = router;