let express = require('express');
let router = express.Router();

let kitchenToolsModel = require('../models/kitchenToolsModel');

router.get('/', (req, res, next) => {
    kitchenToolsModel.find().exec((err, inventoryList) => {
        if (err) console.log(err);
        res.json(inventoryList);
    });
});

router.route("/").post(async (req, res) => {
    const newKitchenToolsItem = await new kitchenToolsModel(req.body);
    newKitchenToolsItem.save(function (err) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        req.app.locals.wss.broadcast(JSON.stringify({ type: 'kitchenTools', item: newKitchenToolsItem }));
        res.json(newKitchenToolsItem);
    });
});

router.route('/:id/delete').post(async (req, res) => {
    await kitchenToolsModel.findByIdAndRemove(req.params.id, (err) => {
        if (err) return res.send(err);
        req.app.locals.wss.broadcast(JSON.stringify({ type: 'kitchenTools', item: { _id: req.params.id, isItemDeleted: true } }));
    });
    return res.send('Inventory Item Delete!');
});

router.route('/:id/update').post(
    (req, res) => {
        kitchenToolsModel.findByIdAndUpdate(req.params.id, req.body, (err) => {
            if (err) return res.send(err);
            req.app.locals.wss.broadcast(JSON.stringify({ type: 'kitchenTools', item: req.body }));
            return res.send('Inventory Item Updated!');
        });
    });

module.exports = router;