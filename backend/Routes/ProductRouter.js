
const router = require('express').Router();

router.post('/login', loginValidation, login);

module.exports = router;
