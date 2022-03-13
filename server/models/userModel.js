const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: { type: String, required: true },
    // unique - is a boolean property that allow to create an individual index  
    // in mongoDB which prevents the documents from duplicates in the collection!
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}

    // authorizationType: string || enum = '';
    // allergens: string[] = [];
    // eatingType: string = '';
    // spicinessType: string = '';

// ,{
//     // This collection name, creates a mongoDB collection
//     //  with that name in the data base!
//     collection: 'user-data'
// }
)

const model = mongoose.model('user', User);

module.exports = model;