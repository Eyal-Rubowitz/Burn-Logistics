const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ingredientModel = new Schema({
    dishId: String,
    foodItemId: String,
    quantity: Number,
    unit: String,
    cost: Number,
    note: String
});

module.exports = mongoose.model('ingredient', ingredientModel);
