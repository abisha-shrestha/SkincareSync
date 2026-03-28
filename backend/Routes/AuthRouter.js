// const { login, signup } = require('../Controllers/AuthController');
// const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

// const router = require('express').Router();

// router.post('/login', loginValidation, login);
// router.post('/signup', signupValidation, signup);

// module.exports = router;


const { login, signup, sendOtp, verifyOtp, resetPassword } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

module.exports = router;