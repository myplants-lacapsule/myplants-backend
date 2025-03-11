const mongoose = require('mongoose');

const factsSchema = mongoose.Schema({
    title: String,
    description: String,
});

const Fact = mongoose.model("facts", factsSchema);

module.exports = Fact;