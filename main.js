const { app, BrowserWindow } = require('electron')

function createWindow() {

    window = new BrowserWindow({
        width: 1200, height: 700, webPreferences: {
            nodeIntegration: true
        }})
    window.loadFile('GUI/index.html')

    var { PythonShell } = require('python-shell');


    PythonShell.run('GUI/python/objectList.py', null, function (err, results) {
        if (err) throw err;       
        console.log('hello.py finished.');
        console.log('results', results);
    });


}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
