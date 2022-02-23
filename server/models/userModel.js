const mongoose = require('mongoose');

// unique - a property for creates an individual index
const User = new mongoose.Schema({
    name: { type: String, required: true },
    // unique creates a spatial index in mongoDB for prevent duplicates
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    quote: { type: String }
}
// ,{
//     // This collection name, creates a mongoDB collection
//     //  with that name in the data base!
//     collection: 'user-data'
// }
)

const model = mongoose.model('user', User);

module.exports = model;