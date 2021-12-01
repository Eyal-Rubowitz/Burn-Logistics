let express = require('express');
let router = express.Router();

let foodItemModel = require('../models/foodItemModel');
let wsMessageModel = require('../models/wsMessageModel');

router.get('/', (req, res, next) => {
    foodItemModel.find().exec((err, foodItemList) => {
        if (err) console.log(err);
        res.json(foodItemList);
    });
});

router.route("/").post(async (req, res) => {
    console.log('fi req.body:', req.body);
    const newFoodItem = await new foodItemModel(req.body);
    newFoodItem.save(function (err) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        // req.app.locals.wss.broadcast(JSON.stringify({ type: 'foodItem', item: newFoodItem }));
        const message = new wsMessageModel({ body: JSON.stringify({ type: 'foodItem', item: newFoodItem }) });
        message.save();
        res.json(newFoodItem);
    });
});

router.post('/:id/delete', (req, res) => {
    foodItemModel.findByIdAndRemove(req.params.id, (err) => {
        if (err) return res.send(err);
        // req.app.locals.wss.broadcast(JSON.stringify({ type: 'foodItem', item: { _id: req.params.id, isItemDeleted: true } }));
        const message = new wsMessageModel({ body: JSON.stringify({ type: 'foodItem', item: { _id: req.params.id, isItemDeleted: true } }) });
        message.save();
    });
    return res.send("Food Item delete!");
});

router.route("/:id/update").post(async (req, res) => {
        console.log('req.body:', req.body);
        await foodItemModel.findByIdAndUpdate(req.params.id, req.body,(err) => {
            if (err) return res.send(err);
            // console.log('wss.clients: ',req.app.locals.wss.clients);
            // req.app.locals.wss.broadcast(JSON.stringify({ type: 'foodItem', item: req.body }));
            const message = new wsMessageModel({ body: JSON.stringify({ type: 'foodItem', item: req.body }) });
            message.save();
            return res.send('FoodItem Updated!');
        });
    });

module.exports = router;