let express = require('express');
let router = express.Router();
const bcrypt = require('bcryptjs');

let userModel = require('../models/userModel');
let wsMessageModel = require('../models/wsMessageModel');

// router.get('/', (req, res, next) => {
// 	userModel.findOne({ _id: req.body._id }).exec((err, user) => {
// 	  if (err) console.log(err);
// 	  res.json(user);
// 	});
//   });

router.route('/').post(async (req, res) => {
        console.log('userRegistration 16 req.body: ', req.body);
		const newPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = newPassword;
        const newUser = await new userModel(req.body);
		newUser.save((err) => {
			if (err) {
			  console.log(err);
			  return res.send(err);
			}
			// req.app.locals.wss.broadcast(JSON.stringify({ type: 'meal', item: newMeal }));
			const message = new wsMessageModel({ body: JSON.stringify({ type: 'userAuth', user: newUser }) });
			// console.log('route userRegistration - message: ', message);
			message.save();
			res.json(newUser);
		  });
        // await userModel.create({
		// 	name: newUser.name,
		// 	email: newUser.email,
		// 	password: newPassword,
		// })
        //  res.json(newUser);
		// res.json({ status: 'ok' })
	// } catch (err) {
	// 	res.json({ status: 'error', error: 'Duplication error, a user with this email is already exists' })
	// }
})

module.exports = router;