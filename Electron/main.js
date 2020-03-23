const { app, BrowserWindow, ipcMain } = require('electron')
var mainWindow = null
var addressDialog = null


function createWidowAddressDialog(){
    // Create the browser window.
    addressDialog = new BrowserWindow({
        width: 500,
        height: 250,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        maximizable: false
    })
    
    addressDialog.on('closed', (e) => {
        app.quit()
    })

    // and load the index.html of the app.
    addressDialog.loadFile('../screens/windows/dialogs/widow_address/widow_address.html')
    
}

app.on('ready', createWidowAddressDialog)

ipcMain.on('primaryLoad', (event, arg) => {
    //currentHeadWindow.on('closed', null)
    addressDialog.removeAllListeners()
    addressDialog.destroy()
    createWindow()
})

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
  win.loadFile('../screens/windows/welcome_window/welcome_window.html')
}


app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//Create instance of widow
global.widow = require('./widow/widow.js').default