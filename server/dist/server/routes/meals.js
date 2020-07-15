"use strict";
var express = require('express');
var router = express.Router();
let mealModel = require('../models/mealModel');
// list
// create
// update
// delete
/* GET users listing. */
router.get('/', function (req, res, next) {
    mealModel.find().exec((err, meals) => {
        if (err)
            console.log(err);
        res.json(meals);
    });
});
module.exports = router;
