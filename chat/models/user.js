var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportlocal = require('passport-local-mongoose');

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    socketId: {
        type: String
    },
    lastMsg: {
        type: String
    },
    online: {
        type: Boolean,
        default: false,
    },
    chats: [{
        from: String,
        to: String,
        message: String,
        status: {
            type: String,
            default: 'sent'
        },
        read: {
            type: Boolean,
            default: false
        },
        image: {
            type: Boolean,
            default: false
        },
        audio: { 
            type: Boolean,
            default: false
         },
        base64: String
    },
{
    timestamps: {
        createdAt: 'created_at'
    }
}]
});

userSchema.plugin(passportlocal);

module.exports = mongoose.model('User', userSchema);