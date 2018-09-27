const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    /* eslint-disable no-console */
    console.log('connect :'+ socket.id);

    socket.on('message', msg => {
        console.log(msg);
        io.emit('message',msg);
    });

    socket.on('code', code => {
        console.log(code);
        io.emit('code',code);
    });
    
    socket.on('disconnect',() => {
        console.log('disconnect : '+socket.id);
    });
});

http.listen(3000,() => {
    console.log('listen');
}); 
