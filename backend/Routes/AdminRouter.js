const router = require('express').Router();
const adminOnly = require('../Middlewares/AdminMiddleware');
const { getStats, getUsers, deleteUser, getProducts, createProduct, updateProduct, deleteProduct, getAnalytics } = require('../Controllers/AdminController');
router.get('/analytics', getAnalytics);

router.use(adminOnly); // all routes below are admin-protected

router.get('/stats', getStats);

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;