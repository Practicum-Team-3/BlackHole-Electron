const { app, BrowserWindow, ipcMain } = require('electron')
const electron = require('electron')
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
    
   // console.log(addressDialog.webContents)
    
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
    createWindow()
    addressDialog.destroy()
})


function createWindow () {
  // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        minWidth: 600,
        minHeight: 300,
        webPreferences: {
            nodeIntegration: true
        }
    })
    
    // and load the index.html of the app.
    mainWindow.loadFile('../screens/windows/welcome_window/welcome_window.html')
    
}


ipcMain.on('openChildWindow', (event, address, width, height, modal) => {
    createChildWindow(mainWindow, address, modal)
})

function createChildWindow(parent, address, width, height, modal){
    // Create the browser window.
    var modal = new BrowserWindow({
        width: width,
        height: height,
        parent: parent,
        modal: modal,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    
    modal.loadFile(address)
    modal.once('ready-to-show', () => {
        modal.show()
    })
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
global.ele = electron