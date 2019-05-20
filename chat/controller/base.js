var User = require('../models/user');

module.exports.IOHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('user connected: ' + socket.id);
        module.exports = socket;

        socket.on('login', (id) => {
          console.log('loggin in...');
          console.log('MongoId: ', id);
          User.findOneAndUpdate({ _id: id }, { socketId: socket.id, online: true })
          .then(user => {
            console.log(user);
          });
        }); 
        
        socket.on('msg', (data) => {
          console.log('Sending msg: ' + data.message + ' to ' + data.to);
          
          User.findOne({ socketId: data.to })
          .then(user => {
            var online = user.online;
            var toUser = user.username;
            if (online) {
              io.to(data.to).emit('pmsg', { to: toUser, from: data.from, message: data.message, status: 'sent', read: false, image: false, audio: false });
              // User.findOneAndUpdate({ socketId: data.to }, { lastMsg: data.message, $push: { chats: { to: toUser, from: data.from, message: data.message } } }, {upsert: true})
              // .then(user => {
              //   console.log(user);
              // });
              user.lastMsg = data.message;
              user.chats.push({ to: toUser, from: data.from, message: data.message });
              user.save();

              User.findOne({ username: data.from })
              .then(user => {
                user.chats.push({ to: toUser, from: data.from, message: data.message });
                user.save();
              });
            } else {
              User.findOne({ username: data.from })
              .then(user => {
                user.chats.push({from: data.from, to: toUser, message: data.message });
                user.save();
                User.findOne({ socketId: data.to })
                  .then(user => {
                    user.chats.push({from: data.from, to: toUser, message: data.message });
                    user.save();
                  });
                if (data.message.indexOf('hey') > -1 || data.message.indexOf('hi') > -1 || data.message.indexOf('hello') > -1) {
                  io.to(user.socketId).emit('pmsg', {from: toUser, to: data.from, message: 'Hi, I am currently offline', status: 'sent', read: false, image: false, audio: false });
                  user.chats.push({from: toUser, to: data.from, message: 'Hi, I am currently offline'});
                  user.save();
                  User.findOne({ socketId: data.to })
                  .then(user => {
                    user.chats.push({from: toUser, to: data.from, message: 'Hi, I am currently offline'});
                    user.save();
                  });
                } else if (data.message.indexOf('when') > -1) {
                  io.to(user.socketId).emit('pmsg', {from: toUser, to: data.from, message: 'I\'ll text you when i\'ll be online', status: 'sent', read: false, image: false, audio: false });
                  user.chats.push({from: toUser, to: data.from, message: 'I\'ll text you when i\'ll be online'});
                  user.save();
                  User.findOne({ socketId: data.to })
                  .then(user => {
                    user.chats.push({from: toUser, to: data.from, message: 'I\'ll text you when i\'ll be online'});
                    user.save();
                  });
                } else if (data.message.indexOf('Ok') > -1 || data.message.indexOf('OK') > -1 || data.message.indexOf('Okay') > -1 || data.message.indexOf('OKAY') > -1 || data.message.indexOf('ok') > -1) {
                  io.to(user.socketId).emit('pmsg', {from: toUser, to: data.from, message: ':)', status: 'sent', read: false, image: false, audio: false });
                  user.chats.push({from: toUser, to: data.from, message: ':)'});
                  user.save();
                  User.findOne({ socketId: data.to })
                  .then(user => {
                    user.chats.push({from: toUser, to: data.from, message: ':)'});
                    user.save();
                  });

                }
              });
            }
          });
        });

        socket.on('read', (username) => {
            User.findOne({ username: username })
            .then(result => {
                console.log("chats XYZ ", result.chats);
                for(let i=0; i<result.chats.length; i++) {
                  result.chats[i].read = true;
                }
                result.save();
            });
        });

        socket.on('image', (data) => {
          console.log('image invoked');
          // console.log(data.buff);
          io.to(data.to).emit('imgmsg', data.buff);
          User.findOne({ socketId: data.to })
          .then(user => {
            console.log(user);
            const toUser = user.username
            user.chats.push({ to: user.username, from: data.from, image: true, base64: data.buff });
            user.save()
            User.findOne({ username: data.from })
          .then(user => {
            console.log(user);
            user.chats.push({ to: toUser, from: data.from, image: true, base64: data.buff });
            user.save();
          });
        });
            
          });

          
          socket.on('audio', (data) => {
            console.log('audio invoked');
            // console.log(data.buff);
            io.to(data.to).emit('audmsg', data.buff);
            User.findOne({ socketId: data.to })
            .then(user => {
              console.log(user);
              const toUser = user.username
              user.chats.push({ to: user.username, from: data.from, audio: true, base64: data.buff });
              user.save()
              User.findOne({ username: data.from })
            .then(user => {
              console.log(user);
              user.chats.push({ to: toUser, from: data.from, audio: true, base64: data.buff });
              user.save();
            });
          });
              
            });


        socket.on('disconnect', () => {
          console.log(socket.id + ' disconnected');
          User.findOneAndUpdate({ socketId: socket.id }, { online: false})
          .then(user => {
            console.log(user);
          });
        });

        socket.on('logout', () => {
          User.findOneAndUpdate({ socketId: socket.id }, { online: false})
          .then(user => {
            console.log(user);
          });
          // socket.disconnect();
        });
      });
};
