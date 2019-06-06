var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var socket = require('socket.io');
var mongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var path = require('path');

email = []; 
dsv = [];
creative = [];
const db = require('./config/db');

var route = require('./routes/api');
// Mongodb Connection
mongoose.connect(db.url, function() {
    
        console.log('Mongodb connected at www.mlab.com!!');
   /* });
    // Connect to mongodb
    mongoClient.connect( db.url, function(err, database) {
        if(err) {
            console.log(err);
        } 
        
        console.log('mongodb connected!!');
        
        const Chat = database.db('mongochat');
        const chat = Chat.collection('chats'); */
    var io = socket(server);

    io.on('connection', function(socket) {
        console.log('New connection made!!', socket.id);
        // new user online
       socket.on('new user', function(data) {
       socket.join(data.room);
        if (data.room == 'Email Marketing') {
            socket.nickname1 = data;
            email.push(socket.nickname1);
            console.log('Email', email);
            io.in(data.room).emit('usernames', email);
        } else if (data.room == 'Dsv & Preview') {
            socket.nickname2 = data;
            dsv.push(socket.nickname2);
            console.log('Dsv', dsv);
        io.in(data.room).emit('usernames', dsv);
        } else {
            socket.nickname3 = data;
            creative.push(socket.nickname3);
            console.log('Creative', creative);
        io.in(data.room).emit('usernames', creative);
        }
    });

    socket.on('disconnect', function(data) {
        console.log('disconnected', socket.id);
        var forEmail = email.indexOf(socket.nickname1);
        var forDsv = dsv.indexOf(socket.nickname2);
        var forCreative = creative.indexOf(socket.nickname3);
        if(forEmail !== -1) {
            email.splice( forEmail, 1);
            io.in('Email Marketing').emit('usernames', email);
        } else if (forDsv !== -1) {
            dsv.splice( forDsv, 1);
            io.in('Dsv & Preview').emit('usernames', dsv); 
        } else if (forCreative !== 1) {
            creative.splice(forCreative, 1);
            io.in('Creative').emit('usernames', creative);   
        }
    })
     
   socket.on('join', function(data) {
        socket.join(data.room);
     //   chat.find({room: data.room}).toArray(function(err, docs) {
       //     if(err) {
         //       console.log(err);
           // }
          //  socket.emit('chat history', docs);
       // });
        console.log(data.user + ' Joined the room :- ' + data.room);
        socket.broadcast.to(data.room).emit('new user joined', {user: data.user, message:'has joined this room!!'});
    });
    
    socket.on('leave', function(data) {
        console.log(data.user + ' left the room :- ' + data.room);
        socket.broadcast.to(data.room).emit('left room', {user: data.user, message:'has left this room!!'});
        socket.leave(data.room);
        if (data.room == 'Email Marketing') {
            socket.nickname1 = data;
            email.pop(socket.nickname1);
            console.log('Email', email);
            io.in(data.room).emit('usernames', email);
        } else if (data.room == 'Dsv & Preview') {
            socket.nickname2 = data;
            dsv.pop(socket.nickname2);
            console.log('Dsv', dsv);
        io.in(data.room).emit('usernames', dsv);
        } else {
            socket.nickname3 = data;
            creative.pop(socket.nickname3);
            console.log('Creative', creative);
        io.in(data.room).emit('usernames', creative);
        }
    });
    
    socket.on('message', function(data) {
        var d = new Date();
       // chat.insertOne(data, function(err, res) {
         //   console.log('Wooo...New message Inserted in database!!')
       // })
        io.in(data.room).emit('new message', {user: data.user, message: data.message, time: data.Time}); 
    });
    
    socket.on('typing', function(data) {
        console.log(data.user + ' typing in room :- ' + data.room);
        socket.broadcast.to(data.room).emit('user typing', {user: data.user, message:'is typing ...!!'});
    
    });
    
    }); 

    
     
    
});

var app = express();

// Add middlewares
app.use(bodyParser.json());
app.use(cors());
app.use('/api', route);


var server = app.listen(3000, function() {
    console.log('server started at port: 3000!!');
});

