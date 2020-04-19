const { app, BrowserWindow, ipcMain } = require('electron')
const electron = require('electron')
var mainWindow = null
var addressDialog = null


function startBlackHole(){
    //Create instance of widow
    global.widow = require('./widow/widow.js').default
    
    // Open address window
    createAddressWindow()
}

app.on('ready', startBlackHole)

ipcMain.on('primaryLoad', (event, arg) => {
    createMainWindow()
    addressDialog.destroy()
})

function createAddressWindow(){
    // Create window for address
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

    // and load the index.html of the app.
    addressDialog.loadFile('./screens/windows/dialogs/widow_address/widow_address.html')
}

function createMainWindow() {
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
ipcMain.on('openChildWindow', (event, address, width, height, resizable, modal, showMenu=false, external=false, frameless=false, arguments=[]) => {
    createChildWindow(mainWindow, address, width, height, resizable, modal, showMenu, external, frameless, arguments)
})

function createChildWindow(parent, address, width, height, resizable, modal=false, showMenu=false, external=false, frameless=false, arguments=[]){
    // Create the browser window.
    var window = new BrowserWindow({
        width: width,
        height: height,
        parent: parent,
        resizable: resizable,
        modal: modal,
        frame: !frameless,
        webPreferences: {
            nodeIntegration: !external,
            enableRemoteModule: !external,
            additionalArguments: arguments
        }
    })
    if (!showMenu){
        window.removeMenu()
    }
    
    if (external){
        window.loadURL(address)
    }else{
        window.loadFile(address)
    }
    
}

//====================
//
//====================

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
//    if (process.platform !== 'darwin') {
        app.quit()
//    }
})
