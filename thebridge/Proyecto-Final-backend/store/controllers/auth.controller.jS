// module.exports = { register, login };
/*- register: Registrar nuevo usuario
    - login: Autenticar y generar JWT*/


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: 'Usuario ya existe' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ msg: 'Usuario creado' });
    } catch (err) {
        console.error("Error en registro:", err);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login request:", { email, password });

        const user = await User.findOne({ email });
        if (!user) {
            console.log("Usuario no encontrado");
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const match = await bcrypt.compare(password, user.password);
        console.log("Password match:", match);

        if (!match) {
            console.log("Contraseña incorrecta");
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });


        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Error en login:", err);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

/*
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ msg: 'Credenciales inválidas' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};
*/
module.exports = { register, login };