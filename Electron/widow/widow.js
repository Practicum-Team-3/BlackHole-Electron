const electron = require('electron')
// const defaultWidowAddress = "http://localhost:5000"
const defaultWidowAddress = "http://172.18.128.1:8080"

/**
 * @class Widow
 * @version 1.1.1
 * @description Abstraction for the communication to the Widow backend.
 *              No need to instantiate, just reference the shared instance widow
 *              
 * @param {string} widowAddress Address to back-end "Widow"
 */
function Widow(){
    this.defaultAddress = defaultWidowAddress
    this.widowSettings = new WidowSettings(this.defaultAddress)
    
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
        syncUpdate(20)
        // Load all the scenarios from the list
        return this.scenarios.loadAllScenarios()
        
    }.bind(this))
    .then(function(){
        console.log("Loaded scenarios")
        syncUpdate(50)
        //Load available boxes
        return this.boxes.load()
        
    }.bind(this))
    .then(function(){
        console.log("Loaded boxes")
        syncUpdate(70)
        //Load available programs
        return this.programs.load()
        
    }.bind(this))
    
    
    function syncUpdate(progress){
        try{
            syncUpdateCallback(progress)
        }catch{}
    }
}

//=============            
// WidowSettings
//=============
function WidowSettings(_address){
    var address = address
    
    this.getAddress = function(){
        return address
    }
    this.setAddress = function(_address){
        address = _address
    }
}
        
//=============            
// Modifiable
//=============
function whatever(){
    util.setRemoteCallbackFreer(function(something){console.log(something)}, 0, "d", 0, "ss")
    //setRemoteCallbackFreer(fn: Function, frameId: number, contextId: String, id: number, sender: any): void
//    electron.webFrame.routingId
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
}