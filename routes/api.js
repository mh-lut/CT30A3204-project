//0608560
//CT30A3204 Advanced Web Applications
//Project
//1.3.2023
//Help received: Coursematerial, https://www.geeksforgeeks.org/mongoose-updateone-function/, https://express-validator.github.io/docs/validation-result-api/


var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const {body, validationResult} = require("express-validator");

const User = require("../models/User");
const Todo = require("../models/Todo");
const Message = require("../models/Message");
const Comment = require("../models/Comment");

const jwt = require("jsonwebtoken");
const validateToken = require("../auth/validateToken");
const passport = require('passport');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});

//get users email
router.get('/private', passport.authenticate("jwt", {session: false}), (req, res, next) => {
  return res.json({email: req.user.email });
});

//register post
router.post('/user/register',
  upload.none(),
  body("email").trim().isEmail().withMessage("Invalid email"),
  body("password").isStrongPassword({minLength: 8}).withMessage("Too weak password: Use number, lowercase, uppercase, symbol and min lenght = 8"),
  body("username").isLength({min: 3}).trim().withMessage("Too short username: min=3"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // check that no errors
      //if errors send msg
      const errorsResult = errors.mapped();
      if(errorsResult.email) {
        return res.json({message: errorsResult.email.msg})
      }
      if(errorsResult.username) {
        return res.json({message: errorsResult.username.msg})
      }
      if(errorsResult.password) {
        return res.json({message: errorsResult.password.msg})
      }
    }
    //check that is email already use
    User.findOne({email: req.body.email}, (err, user) => {
      if(err) {
        throw err;
      }
      if(user){
        return res.json({message: "Email already in use"})
      
      } else {
        //check that is username already use
        User.findOne({username: req.body.username}, (err, username) => {
          if(err) {
            throw err;
          }
          if(username){
            return res.json({message: "Username already in use"})
          }
        });
        bcrypt.genSalt(4, (err, salt) => {
          if(err) throw err;
          //hash password for storage
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err) throw err;
            User.create( // create new user
              {
                email: req.body.email,
                username: req.body.username,
                password: hash
              },
              (err, ok) => {
                if(err) throw err;
                return res.json({
                  success: true
                });
              }
            );
          });
        });
      }
    });
});
//login post
router.post('/user/login',
body("email").trim(),
upload.none(),
  (req, res, next) => {
    User.findOne({email:req.body.email}, (err, user) => {
      if(err) throw err
      if(!user) {
        return res.json({message: "Invalid credentials"})
      } else {
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch) { // if password is ok
            const jwtPayload = {
              id: user._id,
              email: user.email
            }
            jwt.sign(
              jwtPayload,
              process.env.SECRET,
              {
                expiresIn: 60*120, //expiration date
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: token
                });
              }
            );
          } else{
            return res.json({message: "Invalid credentials"});
          };

        })
      }
    
    });
});

//get message headline
router.get('/list/posts', function(req, res, next) {
  Message.find({}, (err, message) => {
    if(err) throw err;
    if (message) {
      headlines = [];
      ids = [];
      for (let i = 0; i < message.length; i++) {
        headlines.push(message[i].headline);
        ids.push(message[i]._id);
        
      }
      return res.json({"headlines": headlines, "ids": ids});
      
    }else {
      return res.json();
    }
    
  });
});

//add message
router.post('/message', passport.authenticate("jwt", {session: false}), (req, res, next) => {
  //check that everything needed has arrived
  if(!req.body.content || !req.user._id || !req.body.headline) {
    return res.json({message: "Invalid items"})
  }
  //find the user who sent the message 
  User.findOne({_id: req.user._id}, (err, user) => {
    if(err) throw err;
    //create message to database
    message = {
      user_id: req.body._id, //link to user
      comments_id: [], //id to comments
      user: user.username, //whose
      headline: req.body.headline,
      text: req.body.content, //code snippets
    }
    //create new and get its id
    Message.create(message)
      .then((newMessage) => {
        return res.json(
          {
          ok: "ok",
          id: newMessage._id
          });
      });
    
  });
});

//add comment
router.post('/comment', passport.authenticate("jwt", {session: false}), (req, res, next) => {
  //check that everything needed has arrived
  if(!req.body.comment || !req.user._id || !req.body.messageId) {
    return res.json({message: "No items or user is not logged in"})
  }
  //find the user who sent the message 
  User.findOne({_id: req.user._id}, (err, user) => {
    if(err) throw err;
    //create comment to database
    comment = {
      message_id: req.body.messageId, //link to Message
      user: req.user._id, //whose
      text: req.body.comment,
      user: user.username
    }
    Comment.create(comment)
      .then((newComment) => {
        const newComment_id = newComment._id;
        //update message
        Message.findOne({_id: req.body.messageId}, (err, message) => {
          if(err) throw err; 

          //old comments
          let commentList = [];
          for (let i = 0; i < message.comments_id.length; i++) {
            commentList.push(message.comments_id[i]);
          }
          //new comment
          commentList.push(newComment_id);
      
          Message.updateOne(
            {_id: req.body.messageId},
            {$set: {comments_id: commentList}},
            function(err, result) {
              if (err) throw err;
            }
          )
        });
    });
    return res.json({ok: "ok"})
  });
});

//get username
router.get('/username', passport.authenticate("jwt", {session: false}), (req, res, next) => {
  return res.json({username: req.user.username});
});



module.exports = router;
