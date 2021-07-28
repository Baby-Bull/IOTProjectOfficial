const express = require('express');
const userRouter = express.Router();

const userController = require('../controllers/userController');

userRouter.post('/getUserInfo', userController.onGetUserInfo);

module.exports = userRouter;