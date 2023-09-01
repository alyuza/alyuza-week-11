const jwt = require('jsonwebtoken')
const { JWT_SIGN } = require('../config/jwt.js')

// Admin Authorization
const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).json({ error: `Sorry you don't have permission in this section.` })
  } else {
    const token = authHeader.split(' ')[1]
    try {
      const decodedToken = jwt.verify(token, JWT_SIGN)
      if (decodedToken.role.toLowerCase() === 'admin') {
        next()
      } else {
        res.status(401).json({ error: `Sorry you don't have permission in this section.` })
      }
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

// User Authorization
const userAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).json({ error: `Sorry, role: 'Admin' can't do anything in the 'Employees' section.` })
  } else {
    const token = authHeader.split(' ')[1]
    try {
      const decodedToken = jwt.verify(token, JWT_SIGN)
      if (decodedToken.role.toLowerCase() === 'user') {
        res.locals.username = decodedToken.username
        next()
      } else {
        res.status(401).json({ error: `Sorry, role: 'Admin' can't do anything in the 'Employees' section.` })
      }
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = {
  adminAuthMiddleware,
  userAuthMiddleware,

}
