let express = require('express');
let router = express.Router();

let allerganModel = require('../models/allergenModel');
let wsMessageModel = require('../models/wsMessageModel');

router.get('/', (req, res, next) => {
    allerganModel.find().exec((err, lrgList) => {
        if (err) console.log(err);
        res.json(lrgList);
    });
});

router.route("/").post(async (req, res) => {
    const newLRG = await new allerganModel(req.body);
    newLRG.save(function (err) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        // req.app.locals.wss.broadcast(JSON.stringify({ type: 'allergan', item: newLRG }));
        const message = new wsMessageModel({ body: JSON.stringify({ type: 'allergan', item: newLRG }) });
        message.save();
        res.json(newLRG);
    });
});

router.route('/:id/delete').post(async (req, res) => {
    await allerganModel.findByIdAndRemove(req.params.id, (err) => {
        if (err) return res.send(err);
        // req.app.locals.wss.broadcast(JSON.stringify({ type: 'allergan', item: { _id: req.params.id, isItemDeleted: true } }));
        const message = new wsMessageModel({ body: JSON.stringify({ type: 'allergan', item: { _id: req.params.id, isItemDeleted: true } }) });
        message.save();
        return res.send('Allergan Delete!');
    });
});

router.route('/:id/update').post(
    (req, res) => {
        allerganModel.findByIdAndUpdate(req.params.id, req.body, (err) => {
            if (err) return res.send(err);
            req.app.locals.wss.broadcast(JSON.stringify({ type: 'allergan', item: req.body }));
            const message = new wsMessageModel({ body: JSON.stringify({ type: 'allergan', item: req.body }) });
            message.save();
            return res.send('Allergan Updated!');
        });
    });

module.exports = router;