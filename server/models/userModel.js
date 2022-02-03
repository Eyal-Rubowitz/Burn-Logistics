const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    // unique  - creates a spatial index in mongoDB for prevent duplicates
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
},{
    // This collection property, creates a mongoDB collection
    //  with that name in the data base!
    collection: 'user-data'
})

module.exports = mongoose.model('UserData', User);