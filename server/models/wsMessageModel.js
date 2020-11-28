const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const app = require("../app")

let wsMessageModel = new Schema({
    body: String
});
const wsMessage = mongoose.model('wsMessage', wsMessageModel);


module.exports = wsMessage;