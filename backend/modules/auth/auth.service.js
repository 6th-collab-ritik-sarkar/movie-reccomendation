const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const signup = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = generateToken(user._id);
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};

module.exports = { signup, login };
