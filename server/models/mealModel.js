const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let mealSchema = new Schema({
    chefId: String,
    date: Date,
    categoryType: String,
    diners: Array({'count': Number, dietType: String}),
    budget: Number,
    portion: Number,
    preparing: Date,
    serving: Date,
    sousChefIdList: Array(String), 
    cleaningCrewIdList: Array(String)
});

module.exports = mongoose.model('meal', mealSchema);