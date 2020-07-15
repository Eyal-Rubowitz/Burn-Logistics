const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let allergenModel = new Schema({
    name: String,
    foodItemIdList: Array(String),
    dinersNameList: Array(String)
});

module.exports = mongoose.model('allergen', allergenModel);