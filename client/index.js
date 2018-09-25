const { app, BrowserWindow } = require('electron');

app.on('ready', () => {
    let mainWindow = new BrowserWindow({
        height:800,
        width:1200
    });
    mainWindow.loadFile('./renderer/index.html');

    mainWindow.on('closed',() => {
        mainWindow = null; 
    });
});