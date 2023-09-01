const { Router } = require('express');
const { login } = require('../service/auth-service.js');
const authRouter = Router();

authRouter.post('/login', login);

module.exports = authRouter;