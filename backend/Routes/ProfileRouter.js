const router = require('express').Router();
const { getProfile, updateProfile, changePassword, deleteAccount, saveSkinType, getSkinType } = require('../Controllers/ProfileController');

router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/skin-type', getSkinType);
router.put('/skin-type', saveSkinType);
router.put('/change-password', changePassword);
router.put('/delete-account', deleteAccount);

module.exports = router;