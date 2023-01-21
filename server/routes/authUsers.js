let express = require('express');
const { authMiddleware } = require('../authMiddleware/authMiddleware');
let router = express.Router();




router.get('/test-api', authMiddleware, (req, res, next) => {
    console.log('request handled!');
    // { message: 'Hello User, {username}' }
    let reqUserNameHeader = req.header('authorization');
    res.json({'message': `Hello User ${reqUserNameHeader}`});

});

module.exports = router;