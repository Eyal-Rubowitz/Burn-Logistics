let express = require('express');
let router = express.Router();

let allergenModel = require('../models/allergenModel');
let wsMessageModel = require('../models/wsMessageModel');

router.get('/', (req, res, next) => {
    allergenModel.find().exec((err, lrgList) => {
        if (err) console.log(err);
        res.json(lrgList);
    });
});

router.route("/").post(async (req, res) => {
    const newLRG = await new allergenModel(req.body);
    newLRG.save(function (err) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        // req.app.locals.wss.broadcast(JSON.stringify({ type: 'allergen', item: newLRG }));
        const message = new wsMessageModel({ body: JSON.stringify({ type: 'allergen', item: newLRG }) });
        message.save();
        res.json(newLRG);
    });
});

router.route('/:id/delete').post(async (req, res) => {
    await allergenModel.findByIdAndRemove(req.params.id, (err) => {
        if (err) return res.send(err);
        // req.app.locals.wss.broadcast(JSON.stringify({ type: 'allergen', item: { _id: req.params.id, isItemDeleted: true } }));
        const message = new wsMessageModel({ body: JSON.stringify({ type: 'allergen', item: { _id: req.params.id, isItemDeleted: true } }) });
        message.save();
    });
    return res.send('Allergen Delete!');
});

router.route('/:id/update').post(
    (req, res) => {
        allergenModel.findByIdAndUpdate(req.params.id, req.body, (err) => {
            if (err) return res.send(err);
            req.app.locals.wss.broadcast(JSON.stringify({ type: 'allergen', item: req.body }));
            const message = new wsMessageModel({ body: JSON.stringify({ type: 'allergen', item: req.body }) });
            message.save();
            return res.send('Allergen Updated!');
        });
    });

module.exports = router;