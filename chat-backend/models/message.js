var mongoose = require('mongoose');

var messageSchema = mongoose.Schema( {
    Name: {
        type: String,
    },
    userName: {
        type: String,
    },
    email: {
        type: String,
    },
    message: {
        type: String,
    },
    room: {
        type: String,
    },
    date: {
        type: String,
    }, 
    time: {
        type: String
    }
});

const messages = mongoose.model('messages', messageSchema);

module.exports = messages;
