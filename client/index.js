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
ipcMain.on('login', (event, ID, PW) => {
    io.emit('login', ID, PW);
    io.once('login', (result, user) => {
        userInfo = user;
        console.log(userInfo);
        event.sender.send('login', result);
    })
});

ipcMain.on('register', (event, ID, PW) => {
    io.emit('register', ID, PW);
    io.once('regdnfister', result => {
        event.sender.send('register', result);
    });
});

ipcMain.on('chat', (event, msg) => {
    io.emit('chat', msg,userInfo.ID);
    io.once('chat', msg => {
        event.sender.send('chat-for-me', msg);
    });
});

ipcMain.on('addFriends',(event, name)=>{
    
})

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
        if (url === 'mfd2_new.html') {
            io.on('chat', (msg,ID) => {
                console.log(msg.userID + " " + userInfo.ID);
                if (ID !== userInfo.ID) event.sender.send('chat', msg);
            });
        }
    })

    mainWindow.loadFile('C:/Users/장성윤/Documents/MFD/client/renderer/mfd_2.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});