var User = require('../models/user');
var authenticate = require('../authenticate');
var setUser = require('../controller/base');
module.exports.login = (req, res, next) => {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});   
};

module.exports.signup = (req, res, next) => {
    User.register(new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }), req.body.password, (err, user) => {
        if (err) {
            res.json(err);
        } else {
            res.json(user);
        }
    });
};