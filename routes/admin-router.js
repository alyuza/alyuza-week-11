const { Router } = require('express');
const adminRouter = Router();
const { getAllUsers, getUser, register, updateUser, deleteUser } = require('../service/admin-service');
const { adminAuthMiddleware } = require('../middleware/authorization-middleware');

adminRouter.get('/getAllUsers', adminAuthMiddleware, getAllUsers)
adminRouter.get('/getUser/:id', adminAuthMiddleware, getUser)
adminRouter.post('/register', adminAuthMiddleware, register)
adminRouter.put('/update/:id', adminAuthMiddleware, updateUser)
adminRouter.delete('/delete/:id', adminAuthMiddleware, deleteUser)

module.exports = { adminRouter }
