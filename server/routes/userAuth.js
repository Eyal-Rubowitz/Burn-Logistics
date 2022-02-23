let express = require('express');
let router = express.Router();

let userModel = require('../models/userModel');
// let wsMessageModel = require('../models/wsMessageModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.route('/').get(async (req, res, next) => {
    console.log('calling for getting user from server!');
	await userModel.findOne({ email: req.body.email}).exec((err, user) => {
        if (err) console.log(err);
        console.log('user on server is: ', user);
		res.json(user);
    });
});

router.route('/register').post( async (req, res) => {
	console.log('index 58 req.body: ', req.body);
    try {
		const newPassword = await bcrypt.hash(req.body.password, 10)
		await userModel.create({
			name: req.body.name,
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
	
	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign({ name: user.name, email: user.email }, 'secret123');
		return res.json({ status: 'ok', userToken: token });
	} else {
		return res.json({ status: 'error', user: false });
	}
})

// router.route('/quote').get( async (req, res) => {
// 	const token = req.headers['x-access-token']

// 	try {
// 		const decoded = jwt.verify(token, 'secret123')
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