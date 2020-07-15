const mongoose = require("mongoose");
// import FoodCategoryEnum from "../enums/foodCategoryEnum";
const Schema = mongoose.Schema;

let foodItemModel = new Schema({
    name: String,
    category: String,
    baseUnit: String,
    customUnits: Array({"unitName" : String, "ratio" : Number})
});

module.exports = mongoose.model('foodItem', foodItemModel);