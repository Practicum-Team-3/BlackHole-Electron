const { app, BrowserWindow } = require('electron')
//const ipc = require('electron').ipcMain


function createWindow () {
    

    // Create the browser window.
    let win = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    })
    
    // and load the index.html of the app.
    win.loadFile('../Screens/Windows/WelcomeWindow/WelcomeWindow.html')
    
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//Create instance of scenarios
global.scenarios = require('./widow/scenarios.js').scenarios


/*
ipc.on('update-notify-value', function (event, arg) {
    win.webContents.send('targetPriceVal', arg)
})
*/

