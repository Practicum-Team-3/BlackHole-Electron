const electron = require('electron')

const defaultWidowAddress = "http://localhost"
const defaultCloudSubdomain = "nextcloud"
const defaultCloudPath = "/remote.php/dav/files/admin/"
/**
 * @class Widow
 * @version 1.3.0
 * @description Abstraction for the communication to the Widow backend.
 *              No need to instantiate, just reference the shared instance widow
 *              
 * @param {string} widowAddress Address to back-end "Widow"
 */
function Widow(){
    this.defaultAddress = defaultWidowAddress
    this.widowSettings = new WidowSettings(defaultWidowAddress, defaultCloudSubdomain, defaultCloudPath)
    
    // Make bridge to chromium
    makeBridge()
    
    // Make child objects and pass a reference to this.widowSettings
    var Scenarios = require('./scenarios.js').Scenarios
    var Boxes = require('./boxes.js').Boxes
    var Programs = require('./programs.js').Programs
    /**
     * @type {Scenarios}
     * @description Access the scenarios from Black Widow
     * @memberof Widow
     */
    this.scenarios = new Scenarios(this.widowSettings)
    /**
     * @type {Boxes}
     * @description Access the vagrant boxes from Black Widow
     * @memberof Widow
     */
    this.boxes = new Boxes(this.widowSettings)
    /**
     * @type {Programs}
     * @description Access the installable programs from Black Widow
     * @memberof Widow
     */
    this.programs = new Programs(this.widowSettings)
}

/**
 * @function makeBridge
 * @description Instantiates the background chromium instance to bridge objects
 * @private
 * @memberof Widow
 */
function makeBridge(){
    var {BrowserWindow} = require('electron')
    
    addressDialog = new BrowserWindow({
        width: 500,
        height: 250,
        webPreferences: {nodeIntegration: true},
        show: false
    })

    // Load chromium instance with bridge
    addressDialog.loadFile('./widow/bridge/bridge.html')
}

/**
 * @function setAxiosBridge
 * @description Intended to be called by bridging instance. Sets the axiosBridge global access to the entire library
 * @protected
 * @memberof Widow
 * @param {function} _axiosBridge Bridge function to a chromium Axios worker
 */
Widow.prototype.setAxiosBridge = function(_axiosBridge){
    axiosBridged = _axiosBridge
}


/**
 * @function linkAndSync
 * @memberof Widow
 * @description Performs connection to the backend and calls children to load
 * @param   {string} address Address to Widow backend
 * @returns {Promise} Promise for the completion of the link and sync
 */
Widow.prototype.linkAndSync = function(address, syncUpdateCallback){
    console.log("Widow::linkAndSync....")

    this.widowSettings.setAddress(address)
    syncUpdate(10)
    
    return this.scenarios.loadScenarios()
    .then(function(){
        console.log("Scenario list loaded")
        syncUpdate(30)
        // Load all the scenarios from the list
        return this.scenarios.loadAllScenarios()
        
    }.bind(this))
    .then(function(){
        console.log("Scenarios loaded")
        syncUpdate(70)
        //Load available boxes
        return this.boxes.load()
        
    }.bind(this))
    .then(function(){
        console.log("Boxes loaded")
        syncUpdate(90)
        //Load available programs
        return this.programs.load()
        
    }.bind(this))
    
    
    function syncUpdate(progress){
        try{
            syncUpdateCallback(progress)
        }catch{
            console.log("Skipped syncUpdate")    
        }
    }
}


//=============            
// WidowSettings
//=============
/**
 * @class WidowSettings
 * @description Used to share basic Black Widow connection settings between members
 * @protected
 * @param   {string} _address     Main address of Black Widow
 * @param   {string} _cloudSubdomain Subdomain for cloud service
 * @param   {string} _cloudPath   [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
function WidowSettings(_address, _cloudSubdomain, _cloudPath){
    var address = address
    var cloudSubdomain = _cloudSubdomain
    var cloudPath = _cloudPath
    var cloudAuth = {
        username: 'admin',
        password: 'password'
    }
    
    this.getAddress = function(){
        return address
    }
    this.setAddress = function(_address){
        address = _address
    }
    
    this.getCloudPath = function(){
        return cloudPath
    }
    this.getCloudAddress = function(){
        // Make url with the complete route (still missing subdomain)
        var cloudUrl = new URL(cloudPath, address)
        // Add sumdomain
        cloudUrl.hostname = cloudSubdomain+"."+cloudUrl.hostname
        
        return cloudUrl.href
    }
    
    this.setCloudCredentials = function(username, password){
        cloudAuth.username = username
        cloudAuth.password = password
    }
    this.getCloudCredentials = function(){
        return cloudAuth
    }
}

//======================================================
//=== Automatic instance for shared Electron runtime ===
//======================================================
try{
    // Try to get existing scenarios instance from electron.remote
    var widow = electron.remote.getGlobal('widow')
    
}catch{
    // Create a new instance and put on exports for main to pick up and put on electron.remote
    try{
        exports.default = new Widow()
    }catch{
        console.log("Automatic instance of widow failed to start")
    }
}
    
    
//=============            
// Modifiable helpers
//=============
/**
 * @function onModified
 * @description Helper for adding a modified callback to Modifiable objects
 * @param {Modifiable} modifiable Modifiable object to add listener to
 * @param {function} callback   Callback event listener. Callbacks can receive up to 3 parameters
 * @see Modifiable.onModified()
 */
function onModified(modifiable, callback){
    try{
        modifiable.onModified(callback, electron.remote.getCurrentWebContents().id)
    }catch{
        console.log("Failed to add modified listener")
    }
}
   
/**
 * @function removeOnModifiedListener
 * @description Helper for removing a modified callback from a Modifiable object
 * @param {Modifiable} modifiable Modifiable object to remove listener from
 * @param {function} callback   Callback event listener to remove
 */
function removeOnModifiedListener(modifiable, callback){
    try{
        modifiable.removeOnModifiedListener(callback, electron.remote.getCurrentWebContents().id)
    }catch{
        console.log("Failed to remove modified listener")
    }
}
    
/**
 * @function emitModifiedEvent
 * @description Helper for triggering a modified event on a Modifiable object
 * @param {Modifiable} modifiable Modifiable object to trigger event on
 * @param {function} ignoredCallback Callback to ignore when emitting the event. Usually this would be the updater's own callback
 * @param {string} eventType Name of the event
 * @param {Any} eventArg Argument tied to the event
 */
function emitModifiedEvent(modifiable, ignoredCallback, eventType, eventArg){
    try{
        modifiable.emitModifiedEvent(ignoredCallback, eventType, eventArg)
    }catch{
        console.log("emitModifiedEvent encountered an error")
    }
}
/**
 * @constant {Object} modificationTypes Generic modification types for use with Modifiable
 */
const modificationTypes = {
        ADDED_ELEMENT: "addedElement",   // Reference to new element in eventArg
        REMOVED_ELEMENT: "removedElement", // Pass reference to removed element in eventArg
        DESTROYED: "destroyed", // Element being observed is being destroyed
        EDITED: "edited" // Pass string name of getter for edited member
}