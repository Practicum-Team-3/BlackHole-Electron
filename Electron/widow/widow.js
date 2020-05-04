const electron = require('electron')
const crypto = require('crypto')

const defaultWidowAddress = "http://localhost"
const defaultCloudSubdomain = "nextcloud"
const defaultCloudPath = "/remote.php/dav/files/admin/"
const defaultRemoteDesktopSubdomain = "guac"
const defaultRemoteDesktopPath = "/guacamole/"
const defaultAnalyticsSubdomain = "kibana"
/**
 * @class Widow
 * @version 1.5.0
 * @description Abstraction for the communication to the Widow backend.
 *              No need to instantiate, just reference the shared instance widow
 *              
 * @param {string} widowAddress Address to back-end "Widow"
 */
function Widow(){
    this.defaultAddress = defaultWidowAddress
    var widowSettings = new WidowSettings(defaultWidowAddress, defaultCloudSubdomain, defaultCloudPath, defaultRemoteDesktopSubdomain, defaultRemoteDesktopPath, defaultAnalyticsSubdomain)
    
    // Start global pocket
    pocket = null
    
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
    this.scenarios = new Scenarios(widowSettings)
    /**
     * @type {Boxes}
     * @description Access the vagrant boxes from Black Widow
     * @memberof Widow
     */
    this.boxes = new Boxes(widowSettings)
    /**
     * @type {Programs}
     * @description Access the installable programs from Black Widow
     * @memberof Widow
     */
    this.programs = new Programs(widowSettings)
    
    /**
     * @function setAddress
     * @description Set the address to Black Widiow
     * @memberof Widow
     * @param {string} address
     */
    this.setAddress = function(address){
        widowSettings.setAddress(address)
    }
    
    /**
     * @function getRemoteDesktopAddress
     * @memberof Widow
     * @description Returns the complete url to the remote desktop client
     * @returns {string} Address to remote desktop service
     */
    this.getRemoteDesktopAddress = function(){
        return widowSettings.getRemoteDesktopAddress()
    }
    
    /**
     * @function getAnalyticsAddress
     * @memberof Widow
     * @description Returns the address for the analytics dashboard
     * @returns {string} Address to analytics dashboard
     */
    this.getAnalyticsAddress = function(){
        return widowSettings.getAnalyticsAddress()
    }
}

/**
 * @function getHeldItem
 * @description Returns item held in global pocket and clears pocket
 * @returns {Any} Item in global pocket
 */
Widow.prototype.getHeldItem = function(){
    var tempPocket = pocket
    pocket = null
    return tempPocket
}

/**
 * @function makeBridge
 * @description Instantiates the background chromium instance to bridge objects
 * @private
 * @memberof Widow
 */
function makeBridge(){
    var {BrowserWindow} = require('electron')
    
    var bridge = new BrowserWindow({
        width: 500,
        height: 250,
        webPreferences: {nodeIntegration: true},
        show: false
    })
    

    // Load chromium instance with bridge
    bridge.loadFile('./widow/bridge/bridge.html')
}

/**
 * @function setAxiosBridge
 * @description Intended to be called by bridging instance. Sets the axiosBridge global access to the entire library
 * @private
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

    this.setAddress(address)
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
 * @private
 * @param   {string} _address     Main address of Black Widow
 * @param   {string} _cloudSubdomain Subdomain for cloud service
 * @param   {string} _cloudPath   Path to cloud files
 */
function WidowSettings(_address, _cloudSubdomain, _cloudPath, _remoteDesktopSubdomain, _remoteDesktopPath, _analyticsSubdomain){
    var address = address
    var cloudSubdomain = _cloudSubdomain
    var cloudPath = _cloudPath
    var cloudAuth = {
        username: 'admin',
        password: 'password'
    }
    var remoteDesktopSubdomain = _remoteDesktopSubdomain
    var remoteDesktopPath = _remoteDesktopPath
    var analyticsSubdomain = _analyticsSubdomain
    
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
    
    this.getRemoteDesktopAddress = function(){
        // Make url with the complete route (still missing subdomain)
        var remoteDesktopUrl = new URL(remoteDesktopPath, address)
        // Add sumdomain
        remoteDesktopUrl.hostname = remoteDesktopSubdomain+"."+remoteDesktopUrl.hostname
        
        return remoteDesktopUrl.href
    }
    
    this.getAnalyticsAddress = function(){
        // Make url
        var analyticsUrl = new URL("", address)
        // Add sumdomain
        analyticsUrl.hostname = analyticsSubdomain+"."+analyticsUrl.hostname
        
        return analyticsUrl.href
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
    console.log("Retrieving widow")
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
// File upload helper
//=============
/**
 * @function uploadFileToWidow
 * @description Since uploads interfaced through remote are less efficient, this function makes file uploads on behalf of widow modules.
 *              For a module to be compatible with widowUpload, it requires the implementation of cloud.UploadReceiver
 * @param   {object}   receiver         Object to be notified of the upload upon completion
 * @param   {File}     file             File to upload
 * @param   {function} progressCallback Callback to update on the upload progress, should accept two int parameters: upload progress, upload total.
 * @param   {...any}   properties       Additional properties for the uploaded file that will get passed to the receiver
 *                                      See receiver's uploadComplete() for the expected properties
 * @returns {Promise}  Promise for the completion of the upload and the notification to receiver
 */
const uploadFileToWidow = function(receiver, file, filename, progressCallback, ...properties){
    electron.remote.getCurrentWebContents().session.clearStorageData(["cookies"])
    const axios = require('axios')
    // Prepare promise to return to caller
    return new Promise(function(resolve, reject){
        
        // Calculate hash
        var stream = file.stream()
        var reader = stream.getReader()
        var hash = crypto.createHash("sha256")
        var onHashCalculated = function(){
            console.log("WUC5")
            //See if there's another program with the same hash
            var duplicates = receiver.getListOfFilesWithHash(hash)
            if (duplicates.length>0){//There are duplicates
                
                reject(duplicates)
                return
            }
            
            // Perform the upload with the upload configuration of the receiver
            var uploadConfig = receiver.getUploadConfigForFileWithName(filename)
            uploadConfig.onUploadProgress = function (progressEvent) {
                try{
                    progressCallback(progressEvent.loaded, progressEvent.total)
                }catch{
                    console.log("::Skipping upload progress")
                }
            }
            uploadConfig.data = file
            axios(uploadConfig).then(function (response) {
                
                receiver.uploadComplete(filename, hash, properties)
                .then(function(program){
                    resolve(program)
                }).catch(function(){
                    reject()
                })

            }.bind(receiver)).catch(function (error) {
                
                console.log(error)
                reject()

            }.bind(receiver))
        }.bind(receiver)
        
        // Process hash
        reader.read().then(function processText({done, value}){
            if (!done){
                hash.update(value)
                return reader.read().then(processText);
                
            }else{
                hash = hash.digest("hex")
                onHashCalculated()
            }
        })
    }.bind(receiver))
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
        // Modification of member element
        ADDED_ELEMENT: "addedElement",   // Reference to new element in eventArg
        REMOVED_ELEMENT: "removedElement", // Pass reference to removed element in eventArg
        EDITED_ELEMENT: "editedElement", // Pass reference to edited element in eventArg
        // Modification of self
        DESTROYED: "destroyed", // Element being observed is being destroyed
        EDITED: "edited" // Pass string name of getter for edited member
}