const mongoose = require('mongoose');

const itemsSchema = mongoose.Schema({
    isGiven: { type: Boolean, default: false },
    isPlant: { type: Boolean, default: true },
    title: String,
    description: String,
    photo: String,
    price: { type: Boolean, default: 0 },
    height: { type: Boolean, default: 0 },
    condition: String,
    token: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Item = mongoose.model("items", itemsSchema);

module.exports = Item;