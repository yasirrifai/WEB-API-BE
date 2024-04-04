

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
 username: String,
 password: String,
});

// Hash the password before saving the user model
UserSchema.pre('save', async function(next) {
 if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // 10 is the saltRounds
 }
 next();
});

module.exports = mongoose.model('User', UserSchema);
