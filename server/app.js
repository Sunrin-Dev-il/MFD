const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http,{transports:['websocket']});
const db = require('./db/db');
const user = require('./db/userModel');

db();

io.on('connection', socket => {
    let Room;

    socket.on('chat',(ID,msg)=>{
        // io.to(msg.room).emit('chat',msg.code);
        msg = msg.replace(/</g,'&lt');
        io.to(Room).emit('chat',ID,msg);
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

    socket.on('join_room',room=>{
        Room = room;
        socket.join(room,err=>{
           if(err){
               console.error(err);
               socket.emit('join_room',room,'failed');
           }
           else socket.emit('join_room',room,'success',); 
        });
    });

    socket.on('leaveRoom',room=>{
        socket.leave(room,err=>{
            if(err) console.error(err);
        });
    });

    socket.on('upload',(ID,ment)=>{
        user.findOneAndUpdate({ID:ID},{profile_ment:ment})
        .then(() => {
            socket.emit('upload',ment);
        }).catch((err) => {
            console.error(err);
            socket.emit('upload',err);
        });
    })
    socket.on('addFriend',(userID,friendName)=>{
        user.findOne({ID:friendName})
        .then((friend) => {
            if(friend !== null){
                user.findOneAndUpdate({ID:userID},{$addToSet:{friends:friend._id}})
                .then(() => {
                    socket.emit('addFriend',friend);
                }).catch((err) => {
                    console.error(err);
                    socket.emit('addFriend','failed');
                });
            }
            else socket.emit('addFriend','failed');
        }).catch((err) => {
            console.error(err);
            socket.emit('addFriend', 'failed');
        });
    });

    
});

http.listen(3000,() => {
    console.log('listen');
});