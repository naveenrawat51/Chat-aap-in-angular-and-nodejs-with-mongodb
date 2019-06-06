var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');

// import user Schema
var User = require('../models/user');
var Message = require('../models/message');
// Signup api
router.post('/signup', function(req, res) {
    User.findOne({email: req.body.email}, function(err, user1) {
        if(err) {
            res.status(401).send({err});
        } else {
            if(!user1) {
    const user = new User( {
        Name: req.body.Name,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    });
    user.save(function(err, newUser) {
        if(err) {
            res.json(err);
        } else {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'naveenrawat51@gmail.com',
                  pass: 'yash@2010'
                }
              });
               const email = req.body.email;
              var mailOptions = {
                from: 'naveenrawat51@gmail.com',
                to: email,
                subject: 'Account Created Successfully!!',
                html: '<h3>Your account successfully created on Chat-App!!</h3> <br><br><strong> Email:</strong> ' + req.body.email + '<br><strong> Password:</strong> ' +req.body.password
              };
             transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            let payload = { subject: newUser._id};
            let id = newUser._id;
            let token = jwt.sign(payload, 'secretkey');
            let name = newUser.Name;
            let username = newUser.userName;
            res.status(200).send({token,id, name, username});
        }
    });
}   else {
    res.status(401).send({Message: 'User Has an Account Alraedy'});
}
        }
    }); });

// login api
router.post('/login', function(req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {
            res.status(401).send('Invalid User!!');
        } else {
            if (!user) {
               res.status(401).send({message: 'Invalid Email!!'});  
            } else {
                if (user.password !== req.body.password) {
                   res.status(401).send('Invalid Password!!');    
                } else {
                    let payload = { subject: user._id};
                    let id = user._id;
                    let username = user.userName;
                    let token = jwt.sign(payload, 'secretkey');
                    let name = user.Name;
                    let email = user.email;
                    res.status(200).send({token, name, username, email});
                }
            }
        }
    })
   })

// Message api
router.post('/message', function(req, res) {
    const message = new Message( {
        Name: req.body.Name,
        userName: req.body.userName,
        email: req.body.email,
        message: req.body.message,
        room: req.body.room,
        date: req.body.date,
        time: req.body.time
    });
    message.save(function(err, newUser) {
        if(err) {
            res.json(err);
        } else {
            console.log("New Messaged saved in DataBase!!");
        }
    });
 });
 // get messages by Email Marketing category
router.get('/messages/:room1', function(req, res) {
    Message.find({room: req.params.room1}, function(err, events) {
        if(err) {
            res.json(err);
        } else {
            res.json(events);
        }
    })
})
module.exports = router;