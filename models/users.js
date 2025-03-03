const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone: { type: String, default: null },
    token: String,
    address: {
        street: { type: String, default: null },
        city: { type: String, default: null },
        postalCode: { type: String, default: null },
        country: { type: String, default: null },
        location: { long: String, lat: String },
    }
});

const User = mongoose.model('users', usersSchema);

module.exports = User;