const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http,{transports:['websocket']});
const db = require('./db/db');
const user = require('./db/userModel');

db();

io.on('connection', socket => {
    console.log(socket.id);

    socket.on('chat',(msg,ID)=>{
        // io.to(msg.room).emit('chat',msg.code);
        msg = msg.replace(/</g,'&lt');
        io.emit('chat',msg,ID);
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
        user.findOne({ ID: ID })
        .populate('friends')
        .then((result) => {
            if (result.PW === PW) {
                console.log('login success');
                socket.emit('login', 'success',result);
            }
        }).catch((err) => {
            socket.emit('login', 'failed',err);
            console.error(err);
        });
    });

    socket.on('joinRoom',room=>{
        socket.join(room,err=>{
           if(err){
               console.error(err);
               socket.emit('join','failed');
           }
           else socket.emit('join','success',); 
        });   
    });

    socket.on('leaveRoom',room=>{
        socket.leave(room,err=>{
            if(err){
                console.error(err);
                socket.emit('leave',failed);
            }
            else socket.emit('leave',success,room);
        });
    });

    socket.on('addFriends',(user,friends)=>{
        
    });

});

http.listen(3000,() => {
    console.log('listen');
});