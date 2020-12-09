let express = require('express');
let router = express.Router();

let kitchenToolsModel = require('../models/kitchenToolsModel');
let wsMessageModel = require('../models/wsMessageModel');

router.get('/', (req, res, next) => {
    kitchenToolsModel.find().exec((err, inventoryList) => {
        if (err) console.log(err);
        res.json(inventoryList);
    });
});

router.route("/").post(async (req, res) => {
    const newKitchenToolsItem = await new kitchenToolsModel(req.body);
    newKitchenToolsItem.save((err) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        //req.app.locals.wss.broadcast(JSON.stringify({ type: 'kitchenTools', item: newKitchenToolsItem }));
        const message = new wsMessageModel({ body: JSON.stringify({ type: 'kitchenTools', item: newKitchenToolsItem }) });
        message.save();
        res.json(newKitchenToolsItem);
    });
});

router.route('/:id/delete').post(async (req, res) => {
    await kitchenToolsModel.findByIdAndRemove(req.params.id, (err) => {
        if (err) return res.send(err);
        // req.app.locals.wss.broadcast(JSON.stringify({ type: 'kitchenTools', item: { _id: req.params.id, isItemDeleted: true } }));
        const message = new wsMessageModel({ body: JSON.stringify({ type: 'kitchenTools', item: { _id: req.params.id, isItemDeleted: true } }) });
        message.save();
    });
    return res.send('Kitchen Tool Item Delete!');
});

router.route('/:id/update').post(async (req, res) => {
    await kitchenToolsModel.findByIdAndUpdate(req.params.id, req.body, (err) => {
        if (err) return res.send(err);
        // req.app.locals.wss.broadcast(JSON.stringify({ type: 'kitchenTools', item: req.body }));
        const message = new wsMessageModel({ body: JSON.stringify({ type: 'kitchenTools', item: req.body }) });
        message.save();
        return res.send('Kitchen Tool Item Updated!');
    });
});

module.exports = router;