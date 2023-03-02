//0608560
//CT30A3204 Advanced Web Applications
//Project
//1.3.2023
//Help received:

var express = require('express');
var router = express.Router();
const Message = require("../models/Message");
const Comment = require("../models/Comment");

//Frontend

//register page
router.get('/register.html', function(req, res, next) {
  res.render('register');
});

//login page
router.get('/login.html', function(req, res, next) {
  res.render('login');
});

//home page
router.get('/', (req, res, next) => {
  res.render('home');
});

//question page
router.get('/item/:id', function(req, res, next) {
  //find message
  Message.findOne({_id: req.params.id}, (err, message) => {
    if(err) {return};
    //Find comments
    Comment.find({message_id: req.params.id}, (err, comments) =>{
      if(err) {return};
      //put comments to list
      let listComments = [];
      for (let i = 0; i < comments.length; i++) {
        listComments.push(comments[i].text);
      }
      //put comment user to list
      let listCommentUser = [];
      for (let i = 0; i < comments.length; i++) {
        listCommentUser.push(comments[i].user);
      }
      return res.render("item", {Message: message.text,  MessageUser: message.user, Comments: listComments, CommentUser: listCommentUser});
    })
  });
});

//create message page
router.get('/message', function(req, res, next) {
  res.render('question');
});

module.exports = router;
