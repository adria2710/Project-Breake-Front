const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/register', register);
router.post('/login', login);

router.post('/create-admin', async (req, res) => {
  try {
    const existing = await User.findOne({ email: 'admin@tienda.com' });
    if (existing) return res.status(400).json({ msg: 'El admin ya existe' });

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin',
      email: 'admin@tienda.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    res.status(201).json({ msg: 'Admin creado correctamente' });
  } catch (err) {
    console.error("❌ Error al crear admin:", err.message);
    res.status(500).json({ msg: 'Error al crear admin' });
  }
});

module.exports = router;
