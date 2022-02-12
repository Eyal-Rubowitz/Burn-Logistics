let express = require('express');
let router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');
// let wsMessageModel = require('../models/wsMessageModel');


router.route('/').post( async (req, res) => {
	const user = await userModel.findOne({
		email: req.body.email,
	})

	if (!user) return { status: 'error', error: 'Invalid login' };

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			'secret123'
		)

		return res.json({ status: 'ok', item: token })
	} else {
		return res.json({ status: 'error', item: false })
	}
})

router.route('/').get( async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		const user = await userModel.findOne({ email: email })

		return res.json({ status: user ? 'ok' : 'user not found'})
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

module.exports = router;