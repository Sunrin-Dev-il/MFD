const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http,{transports:['websocket']});
const redis = require('socket.io-redis');
const db = require('./db/db');
const user = require('./db/userModel');

db();

io.on('connection', socket => {

    socket.on('chat',msg=>{
        io.to(msg.room).emit('chat',msg.code);
    });
    
    socket.on('disconnect',() => {
        console.log('disconnect : '+socket.id);
    });

    socket.on('register',(ID,PW)=>{
        const User = new user({
            ID: ID,
            PW: PW
        });
        User.save()
        .then(() => {
            console.log('register Success');
            socket.emit('register','success');
        }).catch((err) => {
            console.error(err);
            socket.emit('register','failed');
        });
    });

    socket.on('login', (ID,PW) => {
        console.log('ID:'+ID+' PW:'+PW);
        user.findOne({ ID: ID }).then((result) => {
            if (result.PW === PW) {
                console.log('login success');
                result.
                socket.emit('login', 'success');
            }
        }).catch((err) => {
            socket.emit('login', 'failed');
            console.error(err);
        });
    });

    socket.on('joinRoom',room=>{
        socket.join(room,err=>{
           if(err){
               console.error(err);
               socket.emit('join','failed');
           }
           else socket.emit('join','success'); 
        });   
    });

    socket.on('leaveRoom',room=>{
        socket.leave(room,err=>{
            if(err){
                console.error(err);
                socket.emit('leave',failed);
            }
            else socket.emit('leave',success);
        });
    });

    

});

http.listen(3000,() => {
    console.log('listen');
});

module.exports = io;