const { Router } = require('express');
const { userAuthMiddleware } = require('../middleware/authorization-middleware');
const { changePassword, viewProfile } = require('../service/user-service');
const userRouter = Router();

userRouter.get('/viewProfile/:inputUsername', userAuthMiddleware, viewProfile)
userRouter.patch('/changePassword/:inputUsername', userAuthMiddleware, changePassword)

module.exports = { userRouter }