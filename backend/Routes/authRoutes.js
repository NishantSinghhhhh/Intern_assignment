const express = require('express');
const { SignUpValidation, signInValidation } = require('../Middlewares/AuthValidation');
const { signup, signIn, addTodo, fetchTasksByUserId, updateTodo } = require('../Controllers/AuthController');

const router = express.Router();

router.post('/signUp', SignUpValidation, signup);
router.post('/signIn', signInValidation, signIn);
router.post('/task', addTodo);

// New route for fetching tasks
router.get('/fetchtasks/:userId', fetchTasksByUserId);

// New route for updating a todo item
router.put('/task/:id', updateTodo); // Assumes 'id' is the unique identifier for the todo

module.exports = router;
