const express = require('express');
const {SignUpValidation} = require('../Middlewares/AuthValidation')
const {signup} = require('../Controllers/AuthController')

const router = express.Router(); // Corrected

router.post('/signUp',SignUpValidation, signup);

module.exports = router; 