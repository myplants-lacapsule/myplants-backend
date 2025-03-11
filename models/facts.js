const mongoose = require('mongoose');

const factsSchema = mongoose.Schema({
    title: String,
    description: String,
    lastDisplayed : Date,
});

const Fact = mongoose.model("facts", factsSchema);

module.exports = Fact;