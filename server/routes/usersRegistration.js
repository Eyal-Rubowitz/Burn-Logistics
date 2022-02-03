let express = require('express');
let router = express.Router();
const bcrypt = require('bcryptjs');

const userModel = require('../models/userModel');
let wsMessageModel = require('../models/wsMessageModel');

router.route('/').post(async (req, res) => {
    try {
        console.log('userRegistration 10 req.body: ', req.body);
        const newUser = await new userModel(req.body);
		const newPassword = await bcrypt.hash(req.body.password, 10)
        newUser.password = newPassword;
        // await userModel.create({
		// 	name: newUser.name,
		// 	email: newUser.email,
		// 	password: newPassword,
		// })
        const message = new wsMessageModel({ body: JSON.stringify({ type: 'user', item: newUser }) });
        message.save();
        //  res.json(newUser);
		// res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplication error, a user with this email is already exists' })
	}
})

module.exports = router;