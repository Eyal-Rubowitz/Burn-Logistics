let express = require('express');
let router = express.Router();

let mealModel = require('../models/mealModel');

router.get('/', (req, res, next) => {
  mealModel.find().exec((err, mealList) => {
    if (err) console.log(err);
    res.json(mealList);
  });
});

router.route('/').post(async (req, res) => {
  const newMeal = await new mealModel(req.body);
  newMeal.save((err) => {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    req.app.locals.wss.broadcast(JSON.stringify({ type: 'meal', item: newMeal }));
    res.json(newMeal);
  });
});

router.route('/:id/delete').post((req, res) => {
  mealModel.findByIdAndRemove(req.params.id, (err) => {
    if (err) return res.send(err);
    req.app.locals.wss.broadcast(JSON.stringify({ type: 'meal', item: { _id: req.params.id, isItemDeleted: true } }));
  });
  // [taskModel, postModel, phoneModel].forEach((model) => {
  //   model.deleteMany({ userId: req.body.id }, (err) => { if (err) console.log(err) });
  // });
  return res.send('Meal Deleted !');
});

router.route('/:id/update').post((req, res) => {
    mealModel.findByIdAndUpdate(req.params.id, req.body, (err) => {
      if (err) return res.send(err);
      // console.log('meal req.app.locals.wss:', req.app.locals.wss);
      req.app.locals.wss.broadcast(JSON.stringify({ type: 'meal', item: req.body }));
      return res.send('Updated !');
    });
  });

module.exports = router;
