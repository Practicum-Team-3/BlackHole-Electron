const electron = require('electron')

const defaultWidowAddress = "http://localhost:8080"
const defaultCloudDomain = "http://localhost:8081"
const defaultCloudPath = "/remote.php/dav/files/admin/"
/**
 * @class Widow
 * @version 1.2.0
 * @description Abstraction for the communication to the Widow backend.
 *              No need to instantiate, just reference the shared instance widow
 *              
 * @param {string} widowAddress Address to back-end "Widow"
 */
function Widow(){
    this.defaultAddress = defaultWidowAddress
    this.widowSettings = new WidowSettings(defaultWidowAddress, defaultCloudDomain, defaultCloudPath)
    
    // Make child objects and pass a reference to this.widowSettings
    var Scenarios = require('./scenarios.js').Scenarios
    var Boxes = require('./boxes.js').Boxes
    var Programs = require('./programs.js').Programs
    this.scenarios = new Scenarios(this.widowSettings)
    this.boxes = new Boxes(this.widowSettings)
    this.programs = new Programs(this.widowSettings)
}

/**
 * @function linkAndSync
 * @memberof Widow
 * @description Performs connection to the backend and calls children to load
 * @param   {string} address Address to Widow backend
 * @returns {Promise} Promise for the completion of the link and sync
 */
Widow.prototype.linkAndSync = function(address, syncUpdateCallback){
    console.log("LinkAndSync....")

    this.widowSettings.setAddress(address)
    syncUpdate(10)
    
    return this.scenarios.loadScenarios()
    .then(function(){
        syncUpdate(30)
        // Load all the scenarios from the list
        return this.scenarios.loadAllScenarios()
        
    }.bind(this))
    .then(function(){
        console.log("Loaded scenarios")
        syncUpdate(70)
        //Load available boxes
        return this.boxes.load()
        
    }.bind(this))
    .then(function(){
        console.log("Loaded boxes")
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
function WidowSettings(_address, _cloudDomain, _cloudPath){
    var address = address
    var cloudDomain = _cloudDomain
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
        return cloudDomain+cloudPath
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
// CHROMIUM BRIDGES
// Functions in this section are intended to wrap chromium-origin object methods
// in objects that can be passed as parameter to nodejs-origin object methods
//======================================================

        
function getAxiosBridge(){
    var _axios = require('axios').create()
    
    return {
        request: _axios.request,
        responseUse: _axios.interceptors.response.use.bind(_axios.interceptors.response)
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