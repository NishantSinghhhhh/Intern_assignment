const express = require('express');
const { SignUpValidation, signInValidation } = require('../Middlewares/AuthValidation');
const { signup, signIn} = require('../Controllers/AuthController');

const router = express.Router();

router.post('/signUp', SignUpValidation, signup);
router.post('/signIn', signInValidation, signIn);
router.post('/task')
module.exports = router;
