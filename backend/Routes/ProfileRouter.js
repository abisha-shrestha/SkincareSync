const router = require('express').Router();
const { getProfile, updateProfile, changePassword, deleteAccount } = require('../Controllers/ProfileController');

router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/change-password', changePassword);
router.put('/delete-account', deleteAccount);

module.exports = router;