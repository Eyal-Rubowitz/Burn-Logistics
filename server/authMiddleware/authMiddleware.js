
const authMiddleware = (req, res, next) => {  
    console.log(`I'm a middleware!`);

    
    let reqHeader = req.header('authorization');
    if(!reqHeader) {  
        res.status(401);
        res.json({"message": "I don't know you"});
    } else {
        res.header("x-user-authorized", true);
        if (reqHeader === 'eyal') { 
            res.json({"message": "secret handshake!"});
        } else {
            console.log("reqHeader: ", reqHeader);
            next();
        }
    }
}

module.exports = { authMiddleware };