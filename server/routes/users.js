let express = require('express');
let router = express.Router();

let userModel = require('../models/userModel');
// let wsMessageModel = require('../models/wsMessageModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.get('/', (req, res, next) => {
	userModel.find().exec((err, userList) => {
		if (err) console.log(err);
		res.json(userList);
	  });
});

router.route('/register').post( async (req, res) => {
	console.log('index 18 req.body: ', req.body);
    try {
		const newPassword = await bcrypt.hash(req.body.password, 10)
		await userModel.create({
			fullName: req.body.fullName,
			email: req.body.email,
			password: newPassword,
		})
		res.json({ status: 'ok' });
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' })
	}
})

router.route('/login').post( async (req, res) => {
	const user = await userModel.findOne({ email: req.body.email });

	if (!user) return { status: 'error', error: 'Invalid login' }
	
	const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

	if (isPasswordValid) {
		const token = jwt.sign({ fullName: user.fullName, email: user.email }, 'secret123');
		return res.json({ status: 'ok', userToken: token });
	} else {
		return res.json({ status: 'error', user: false });
	}
})

/* An issue for decision!!!
Do I want to use this logics? cuz it calls the DB every request
will it be clever to hold object or token like singleton on the server side? 
for instance, if it the user just rout and it requires permission...
*/

// router.route('/quote').get( async (req, res) => {
// 	const token = req.headers['x-access-token']

// 	try {
		// const decoded = jwt.verify(token, 'secret123')
// 		const email = decoded.email
// 		const user = await userModel.findOne({ email: email })

// 		return res.json({ status: 'ok', quote: user.quote })
// 	} catch (error) {
// 		console.log(error)
// 		res.json({ status: 'error', error: 'invalid token' })
// 	}
// })

// router.route('/quote').post( async (req, res) => {
// 	const token = await req.headers['x-access-token']

// 	try {
// 		const decoded = jwt.verify(token, 'secret123')
// 		const email = decoded.email

//         await userModel.updateOne(
// 			{ email: email },
// 			{ $set: { quote: req.body.quote } }
// 		)

// 		return res.json({ status: 'ok' })
// 	} catch (error) {
// 		console.log(error)
// 		res.json({ status: 'error', error: 'invalid token' })
// 	}
// });

module.exports = router;