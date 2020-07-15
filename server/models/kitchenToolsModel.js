const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var kitchenToolsModel = new Schema({
    kitchenItem: String,
    quantity: Number,
    category: String
});

module.exports = mongoose.model('kitchenTools', kitchenToolsModel);
