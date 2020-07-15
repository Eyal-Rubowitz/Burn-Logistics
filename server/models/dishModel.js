const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let dishModel = new Schema({
    mealId: String,
    name: String
});

module.exports = mongoose.model('dish', dishModel);