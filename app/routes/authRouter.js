const express = require('express');
const authRouter = express.Router();

const authController = require('../controllers/authController');

authRouter.post('/login', authController.onLogin);
authRouter.post('/signup', authController.onSignUp);

module.exports = authRouter;