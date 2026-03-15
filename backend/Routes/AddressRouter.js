const router = require('express').Router();
const { getAddresses, addAddress, updateAddress, deleteAddress } = require('../Controllers/AddressController');

router.get('/', getAddresses);
router.post('/', addAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;