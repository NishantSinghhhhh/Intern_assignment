const express = require('express');
const { SignUpValidation, signInValidation } = require('../Middlewares/AuthValidation');
const { signup, signIn, addTodo, fetchTasksByUserId, updateTodo , deleteTodo, updateStatus } = require('../Controllers/AuthController');

const router = express.Router();

router.post('/signUp', SignUpValidation, signup);
router.post('/signIn', signInValidation, signIn);
router.post('/task', addTodo);

// New route for fetching tasks
router.get('/fetchtasks/:userId', fetchTasksByUserId);

router.put('/updatetask/', updateTodo); // Assumes 'id' is the unique identifier for the todo
router.put('/updatetaskStatus/:id', updateStatus);

router.delete('/Deletetodos', deleteTodo); // Add this route

module.exports = router;
