var express = require('express');
var router = express.Router();
var userController = require('../controller/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:id/chats', (req, res, next) => {
  userController.getChats(req, res, next);
});

module.exports = router;
