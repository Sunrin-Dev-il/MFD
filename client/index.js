const { app, BrowserWindow } = require('electron');

app.on('ready', () => {
    let mainWindow = new BrowserWindow({
        height:800,
        width:600,
        'node-intergration' : false
    });

    mainWindow.loadFile('./renderer/mfd.html');

    mainWindow.on('closed',() => {
        mainWindow = null; 
    });
});