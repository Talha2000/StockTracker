const prisma = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return res.status(409).json("User already exists!");
    }

    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { username, email, password: hash } });

    return res.status(200).json("User has been created!");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred.", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { username: req.body.username } });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if (!validatePassword) {
      return res.status(400).json("Wrong username or password!");
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN, {
      expiresIn: '2h',
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const logout = (req, res) => {
  res.clearCookie("access_token", {
    sameSite: "none",
    secure: true,
  }).status(200).json("User has been logged out.");
};

module.exports = {
  register,
  login,
  logout,
};
