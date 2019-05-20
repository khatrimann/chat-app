var express = require('express');
var router = express.Router();
var passport = require('passport');
var loginController = require('../controller/login');
var userController = require('../controller/user');
var socket = require('socket.io');


/* GET users listing. */
router.get('/', function(req, res, next) {
  userController.getUsers(req, res, next);
});

   
 /**
 * @swagger 
 * components:
 * securitySchemes:
 *   bearerAuth:            # arbitrary name for the security scheme
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT  
 * 
 * 
 * definitions:
 *   User:
 *     properties:
 *       username:
 *         type: string
 *       firstname:
 *         type: string
 *       lastname:
 *         type: string
 *       socketId:
 *         type: string
 *       lastMsg:
 *         type: string
 *       online:
 *         type: boolean
 *       chats:
 *         type: array
 *  
 */    
/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - user
 *     description: login user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user login
 *         in: body
 *         required: true
 *         schema:
 *           $ref:'#/definitions/User'
 *     responses:
 *       200:
 *         description: Login succesfully
 *       401:
 *         description: User not found
 *       403:
 *         description: Username and password don't match
 */
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  loginController.login(req, res, next);
});


/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *       - user
 *     description: register user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user resgistration
 *         in: body
 *         required: true
 *         schema:
 *           $ref:'#/definitions/User'
 *     responses:
 *       200:
 *         description:  succesfully
 *      
 */
router.post('/signup', (req, res, next) => {
  loginController.signup(req, res, next);
});

router.post('/:sockedId/send', (req, res, next) => {
  // userController.sendMsg(socket)
})

router.get('/checkJWTToken', (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    console.log("entered");
    console.log(user);
    console.log(req.user);
    if (err)
      return next(err);
    
    if (!user) {
      console.log("User doesn't exists");
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      console.log("User exists");
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);
});

module.exports = router;
