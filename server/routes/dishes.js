let express = require('express');
let router = express.Router();

let dishModel = require('../models/dishModel');
let wsMessageModel = require('../models/wsMessageModel');

router.get('/', (req, res, next) => {
    dishModel.find().exec((err, dishList) => {
        if (err) console.log(err);
        res.json(dishList);
    });
});

router.route("/").post(async (req, res) => {
    const newDish = await new dishModel(req.body);
    newDish.save(function (err) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        // req.app.locals.wss.broadcast(JSON.stringify({ type: 'dish', item: newDish }));
        const message = new wsMessageModel({ body: JSON.stringify({ type: 'dish', item: newDish }) });
        message.save();
        res.json(newDish);
    });
});

router.route('/:id/delete').post(async (req, res) => {
    await dishModel.findByIdAndRemove(req.params.id, (err) => {
        if (err) return res.send(err);
        // req.app.locals.wss.broadcast(JSON.stringify({ type: 'dish', item: { _id: req.params.id, isItemDeleted: true } }));
        const message = new wsMessageModel({ body: JSON.stringify({ type: 'dish', item: { _id: req.params.id, isItemDeleted: true } }) });        
        message.save();
    });
    return res.send('Dish Delete!');
});

router.route('/:id/update').post(
    (req, res) => {
        dishModel.findByIdAndUpdate(req.params.id, req.body, (err) => {
            if (err) return res.send(err);
            // console.log('dish req.app.locals.wss:', req.app.locals.wss);
            // req.app.locals.wss.broadcast(JSON.stringify({ type: 'dish', item: req.body }));
            const message = new wsMessageModel({ body: JSON.stringify({ type: 'dish', item: req.body }) });
            message.save();
            return res.send('Dish Updated!');
        });
    });

module.exports = router;