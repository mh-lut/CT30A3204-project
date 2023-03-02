//0608560
//CT30A3204 Advanced Web Applications
//Project
//1.3.2023
//Help received: Coursematerial, https://www.youtube.com/watch?v=7ZEbBhDXk60


const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'nduoqqoj212181';
const User = require("../models/User");
const passport = require("passport");

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload);
    User.findOne({email: jwt_payload.email}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            //console.log(user);
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));