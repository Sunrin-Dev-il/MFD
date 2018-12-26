const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');
const electron = require('electron');

const io = require('socket.io-client')('http://localhost:3000', {
    transports: ['websocket']
});

let userInfo;
let Room = null;
ipcMain.on('login', (event, ID, PW) => {
    io.emit('login', ID, PW);
    io.once('login', (result, user) => {
        userInfo = user;
        event.sender.send('login', result);
    })
});

ipcMain.on('register', (event, ID, PW) => {
    io.emit('register', ID, PW);
    io.once('register', result => {
        event.sender.send('register', result);
    });
});

ipcMain.on('chat', (event, msg) => {
    io.emit('chat', userInfo.ID,msg);
    io.once('chat', (ID,msg) => {
        event.sender.send('chat-for-me', msg);
    });
});

ipcMain.on('upload', (event,ment)=>{
    io.emit('upload',userInfo.ID,ment);
    io.once('upload',result=>{
        userInfo.profile_ment = result;
        event.sender.send('upload',result);
    })
});

ipcMain.on('user',(event)=>{
   event.sender.send('user',userInfo); 
});

ipcMain.on('addFriend',(event, name)=>{
    io.emit('addFriend',userInfo.ID,name);
    io.once('addFriend',friend=>{
        userInfo.friends.push(friend);
        if (friend != null)
            event.sender.send('addFriend','success');
        else
            event.sender.send('addFriend','failed');
    })
});

ipcMain.on('join_room',(event, room)=>{
    io.emit('join_room',room);
    if(room !== null) io.emit('leaveRoom',Room);
    io.once('join_room',(room,result)=>{
        Room = room;
        if(result === 'success') event.sender.send('join_room',room);
        else console.error(result);
    });
});

ipcMain.on('friendsList',(event)=>{
    event.sender.send('friendsList',userInfo.friends);
});



// ipcMain.on('');

app.on('ready', () => {
    const {  
        width,
        height
    } = electron.screen.getPrimaryDisplay().workAreaSize
    let mainWindow = new BrowserWindow({
        width,
        height,
        'node-intergration': false
    });

    mainWindow.webContents.on('did-navigate', (event,url) => {
        url = url.split('/');
        url = url[url.length-1];
        if (url === 'mfd2_new2.html') {
            io.on('chat', (ID,msg) => {
                if (ID !== userInfo.ID) event.sender.send('chat', ID, msg);
            });
        }
    })

    mainWindow.loadFile('C:/Users/장성윤/Documents/MFD/client/renderer/mfd_2.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});