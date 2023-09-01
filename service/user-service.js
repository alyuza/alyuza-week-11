const bcrypt = require('bcrypt');

// View profile
const viewProfile = async (req, res) => {
  const usernameInput = res.locals.username; // Automatic get data from decoded JWT token
  try {
    const user = await req.db.collection('users').findOne({
      username: usernameInput,
      is_deleted: { $exists: false }
    });
    if (user) {
      return res.status(200).json({ message: `Success get own profile.`, data: user });
    } else {
      return res.status(404).json({ message: `User not found or deleted.` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  const usernameInput = res.locals.username; // Automatic get data from decoded JWT token
  const { password, repeatPassword } = req.body;
  try {
    const user = await db.collection('users').findOne({
      username: usernameInput,
      is_deleted: { $exists: false }
    });
    if (!user) {
      return res.status(404).json({ message: `User with ID not found.` });
    }
    if (!password || password.length < 8) {
      res.status(400).json({ message: "Password must be at least 8 characters long." });
      return;
    }
    if (password !== repeatPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const passwordUpdate = await db.collection('users').updateOne(
      { username: usernameInput },
      { $set: { password: hashedPassword } }
    );
    res.status(200).json({
      message: 'Change password Success.',
      data: passwordUpdate
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  changePassword,
  viewProfile
}