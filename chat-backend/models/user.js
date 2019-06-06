var express = require('express');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema( {
    Name: {
        type: String,
    },
    userName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    }
});

const user = mongoose.model('user', userSchema);

module.exports = user;
