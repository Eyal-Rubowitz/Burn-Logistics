let express = require('express');
let router = express.Router();

let ingredientModel = require('../models/ingredientModel');

router.get('/', (req, res, next) => {
    ingredientModel.find().exec((err, ingredientList) => {
        if (err) console.log(err);
        res.json(ingredientList);
    });
});

router.route("/").post(async (req, res) => {
    console.log('ing req.body:',req.body);    
    console.log('create ingredient in process...');
    const newIngredient = await new ingredientModel(req.body);
    newIngredient.save((err) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        console.log('req ing:',req);
        req.app.locals.wss.broadcast(JSON.stringify({ type: 'ingredient', item: newIngredient }));
        res.json(newIngredient);
    });
});

router.route("/:id/update").post(
    (req, res) => {
        ingredientModel.findByIdAndUpdate(req.params.id, req.body, (err) => {
            if (err) return res.send(err);
            req.app.locals.wss.broadcast(JSON.stringify({ type: 'ingredient', item: req.body }));
            return res.send('Ingredient Updated!');
        });
    });

router.post("/:id/delete", (req, res) => {
    ingredientModel.findByIdAndRemove(req.params.id, (err) => {
        if (err) return res.send(err);
        req.app.locals.wss.broadcast(JSON.stringify({ type: 'ingredient', item: { _id: req.params.id, isItemDeleted: true } }));
    });
    return res.send("Ingredient Delete!");
})

module.exports = router;