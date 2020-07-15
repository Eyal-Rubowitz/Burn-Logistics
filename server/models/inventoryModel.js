const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var inventoryModel = new Schema({
    foodItemId: String,
    quantity: Number,
    unit: String,
    expirationDate: String,
    note: String,
    dishIdOwnedItem: String
});

module.exports = mongoose.model('inventory', inventoryModel);
