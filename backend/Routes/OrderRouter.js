const router = require('express').Router();
const {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    deleteOrder, 
    initiateEsewaPayment,
    verifyEsewaPayment 
} = require('../Controllers/OrderController');
const adminOnly = require('../Middlewares/AdminMiddleware');

router.post('/', placeOrder);
router.get('/', getUserOrders);
router.get('/all', adminOnly, getAllOrders);
router.put('/:id/status', adminOnly, updateOrderStatus);
router.put('/:id/cancel', cancelOrder);
router.delete('/:id', adminOnly, deleteOrder);
router.post('/esewa/initiate', initiateEsewaPayment);
router.get('/esewa/verify', verifyEsewaPayment);

module.exports = router;

