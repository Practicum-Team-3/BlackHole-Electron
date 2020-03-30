const electron = require('electron')
const defaultWidowAddress = "http://localhost:5000"

/**
 * @class Widow
 * @version 1.0.0
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
    this.widowSettings.setAddress(address)
    syncUpdate(10)
    return this.scenarios.loadScenarios()
    .then(function(){
        syncUpdate(20)
        // Load all the scenarios from the list
        return this.scenarios.loadAllScenarios()
        
    }.bind(this))
    .then(function(){
        syncUpdate(50)
        //Load available boxes
        return this.boxes.load()
        
    }.bind(this))
//    .then(function(){
//        syncUpdate(70)
//        //Load available programs
//        return this.programs.load()
//        
//    }.bind(this))
    
    
    function syncUpdate(progress){
        try{
            syncUpdateCallback(progress)
        }catch{}
    }
}

function WidowSettings(_address){
    var address = address
    
    this.getAddress = function(){
        return address
    }
    this.setAddress = function(_address){
        address = _address
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
