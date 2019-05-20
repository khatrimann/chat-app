var User = require('../models/user');

module.exports.sendMsg = (socket, to, msg) => {
    socket.to(to).emit(msg);
}

module.exports.getUsers = (req, res, next) => {
    User.find({})
    .then(users => {
        res.json(users);
    });
};

module.exports.getChats = (req, res, next) => {
    User.findOne({ _id: req.params.id})
    .then(user => {
        res.json(user.chats);
    })
};