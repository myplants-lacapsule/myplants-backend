const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    street: { type: String, default: null },
    city: { type: String, default: null },
    postalCode: { type: Number, default: null },
    country: { type: String, default: null },
    long: { type: Number, default: null },
    lat: { type: Number, default: null },
  });

const usersSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone: { type: String, default: null },
    token: String,
    address: addressSchema || null,
});

const User = mongoose.model('users', usersSchema);

module.exports = User;