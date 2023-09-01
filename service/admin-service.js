const { ObjectId } = require("mongodb");
const bcrypt = require('bcrypt');

// Get all transfer
const getAllUsers = async (req, res) => {
  try {
    const users = await req.db.collection('users').find({ is_deleted: { $exists: false } }).toArray();
    res.status(200).json({
      message: 'Successfully get all employee data.',
      data: users
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get user profile by id
const getUser = async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await req.db.collection('users').findOne({
      _id: new ObjectId(userID),
      is_deleted: { $exists: false }
    });
    if (user) {
      res.status(200).json({
        message: `Success get employee data by Id.`,
        data: user
      });
    } else {
      res.status(404).json({
        message: `User with ID: ${userID} not found.`
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Register or add employee
const validRoles = ["user"];
const register = async (req, res) => {
  const { fullName, jobPosition, department, salary, username, password, repeatPassword, role } = req.body;
  try {
    // Check if username is not empty, no whitespace and alphanumeric only except dot.
    if (!username || username.trim() === "" || !/^[a-zA-Z0-9.]+$/.test(username)) {
      return res.status(400).json({ message: "Username can't be blank and doesn't allow to enter of any special character except dot (.)." });
    }
    // Check if password is not empy and minimum length is 8.
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }
    // Check if role is 'user'.
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role, can register with role 'user' only." });
    }
    // Check if the password and repeat password match.
    if (password !== repeatPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
    const user = await req.db.collection('users').findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Sorry, username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const newUser = await req.db.collection('users').insertOne({
      fullName,
      jobPosition,
      department,
      salary,
      joinDate: currentDate, // set joinDate sama dengan date sekarang
      username,
      password: hashedPassword, // password yg di encrypted
      role
    });
    res.status(201).json({
      message: `User ${username} successfully registered.`,
      ID: newUser.insertedId
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Update job position and salary by ID
const updateUser = async (req, res) => {
  const id = req.params.id;
  const { salary, jobPosition } = req.body;
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found.` });
    }
    const userUpdate = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { salary, jobPosition } } // Include the existing username
    );
    res.status(200).json({
      message: 'Update employee data success.',
      data: userUpdate
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Soft Delete user data
const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const userToDelete = await db.collection('users').findOne({ _id: new ObjectId(id) });

    if (!userToDelete) {
      return res.status(404).json({ message: `User with ID ${id} not found.` });
    }

    if (userToDelete.role === 'admin') {
      return res.status(403).json({ message: `Sorry, role 'Admin' cannot be deleted.` });
    }

    const user = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { is_deleted: true } }
    );

    res.status(200).json({
      message: `Success delete ID = ${id}`,
      data: user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  register,
  updateUser,
  deleteUser
}