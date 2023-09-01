const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SIGN } = require('../config/jwt.js');

// Login
const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await req.db.collection('users').findOne({ username });
  if (!user) {
    res.status(400).json({ error: 'Username is not registered.' });
    return;
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (isPasswordCorrect) {
    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SIGN)
    res.status(200).json({
      message: 'Successfully logged in',
      data: token
    });
  } else {
    res.status(400).json({ error: 'Password is incorrect.' });
  }
}

module.exports = {
  login
}