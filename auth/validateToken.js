//0608560
//CT30A3204 Advanced Web Applications
//Project
//1.3.2023
//Help received: Coursematerial

const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const authHeader = req.headers["authorization"]; //token + extra(Bearer)
    console.log(authHeader);
    let token;
    if(authHeader) {
        token = authHeader.split("  ")[1]; //take only token
    } else {
        token = null; //if no authHeader
    }
    if(token == null) return res.sendStatus(401); //fail
    console.log("Token found");
    console.log(token)
    jwt.verify(token, process.env.SECRET, (err, email) => {
        if(err) return res.sendStatus(403); //no same
        req.email = email;
        next();
    });  
};