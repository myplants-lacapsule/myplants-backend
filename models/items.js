const mongoose = require('mongoose');

const itemsSchema = mongoose.Schema({
    isGiven: { type: Boolean, default: false },
    isPlant: { type: Boolean, default: true },
    title: String,
    description: String,
    photo: [String],
    price: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    condition: String,
    token: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdAt: Date,
});

const Item = mongoose.model("items", itemsSchema);

module.exports = Item;