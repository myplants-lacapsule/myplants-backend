const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    phone: String,
    token: String,
    address: {
        street: String,
        city: String,
        postalCode: String,
        country: String,
        location: { long: String, lat: String },
    }
});

const User = mongoose.model('users', usersSchema);

module.exports = User;