const router = require('express').Router();
const { sendMessage } = require('../Controllers/ContactController');

router.post('/', sendMessage);

module.exports = router;