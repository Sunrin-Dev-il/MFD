const { app, BrowserWindow, ipcMain } = require('electron');

const io = require('socket.io-client')('http://localhost:3000', { transports: ['websocket'] });

ipcMain.on('login', (event, ID,PW) => {
    io.emit('login',ID,PW);
    io.on('login',result=>{
        event.sender.send('login',result);
    })
});

ipcMain.on('register', (event,ID,PW) => {
    io.emit('register', ID,PW);
    io.on('register',result=>{
        event.sender.send('register',result);
    })
});

ipcMain.on('chat',(event,msg)=>{
    io.emit('chat',msg);
    io.on('chat',msg=>{
        event.sender.send('chat',msg);
    })
})

app.on('ready', () => {
    let mainWindow = new BrowserWindow({
        height:800,
        width:600,
        'node-intergration' : false
    });

    mainWindow.loadFile('C:/Users/장성윤/Documents/MFD/client/renderer/mfd_2.html');

    mainWindow.on('closed',() => {
        mainWindow = null; 
    });
});

