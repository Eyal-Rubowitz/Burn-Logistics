let express = require('express');
let router = express.Router();

let inventoryModel = require('../models/inventoryModel');

router.get('/', (req, res, next) => {
    inventoryModel.find().exec((err, inventoryList) => {
        if (err) console.log(err);
        res.json(inventoryList);
    });
});

router.route("/").post(async (req, res) => {
    const newInventoryItem = await new inventoryModel(req.body);
    newInventoryItem.save(function (err) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        req.app.locals.wss.broadcast(JSON.stringify({ type: 'inventory', item: newInventoryItem }));
        res.json(newInventoryItem);
    });
});

router.route('/:id/delete').post(async (req, res) => {
    await inventoryModel.findByIdAndRemove(req.params.id, (err) => {
        if (err) return res.send(err);
        req.app.locals.wss.broadcast(JSON.stringify({ type: 'inventory', item: { _id: req.params.id, isItemDeleted: true } }));
    });
    return res.send('Inventory Item Delete!');
});

router.route('/:id/update').post(
    (req, res) => {
        inventoryModel.findByIdAndUpdate(req.params.id, req.body, (err) => {
            if (err) return res.send(err);
            // console.log('dish req.app.locals.wss:', req.app.locals.wss);
            req.app.locals.wss.broadcast(JSON.stringify({ type: 'inventory', item: req.body }));
            return res.send('Inventory Item Updated!');
        });
    });

module.exports = router;