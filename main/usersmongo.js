// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// userSchema.pre('save', async function (next) {
//     try {
//         // Hash the password before saving
//         const salt = await bcrypt.genSalt();
//         const hashedPassword = await bcrypt.hash(this.password, salt);
//         this.password = hashedPassword;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
