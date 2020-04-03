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
    addressDialog.removeMenu()
    
    addressDialog.on('closed', (e) => {
        app.quit()
    })

    // and load the index.html of the app.
    addressDialog.loadFile('./screens/windows/dialogs/widow_address/widow_address.html')
    
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
    mainWindow.loadFile('./screens/windows/main_window/main_window.html')
    
}

//====================
// Child windows
//====================
ipcMain.on('openChildWindow', (event, address, width, height, resizable, modal) => {
    createChildWindow(mainWindow, address, width, height, resizable, modal)
})

function createChildWindow(parent, address, width, height, resizable, modal=false, showMenu=false){
    // Create the browser window.
    var window = new BrowserWindow({
        width: width,
        height: height,
        parent: parent,
        resizable: resizable,
        modal: modal,
//        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    if (!showMenu){
        window.removeMenu()
    }
    
    window.loadFile(address)
//    window.once('ready-to-show', () => {
//        window.show()
//    })
}

//====================
//
//====================

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//Create instance of widow
global.widow = require('./widow/widow.js').default