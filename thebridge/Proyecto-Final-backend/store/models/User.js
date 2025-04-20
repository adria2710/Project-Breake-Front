const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },  // índice único para no repetir emails
    password: { type: String, required: true },               // se almacenará cifrado (hashed)
    role: { type: String, enum: ['admin', 'cliente'], default: 'cliente', required: true }
});

module.exports = mongoose.model('User', userSchema);
