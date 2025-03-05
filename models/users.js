const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    street: String,
    city: String,
    postalCode: Number,
    country: String,
    long: Number,
    lat: Number,
  });

const usersSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone: { type: String, default: null },
    token: String,
    address: addressSchema
});

const User = mongoose.model('users', usersSchema);

module.exports = User;