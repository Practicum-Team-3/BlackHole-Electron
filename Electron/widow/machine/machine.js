const Modifiable = require('../core/modifiable.js').Modifiable
const Collectable = require('../core/collectionist.js').Collectable
const Provisions = require('./provisions.js').Provisions
const InstalledPrograms = require('./installed_programs.js').InstalledPrograms
const NetworkSettings = require('./network_settings.js').NetworkSettings

/**
 * @class Machine
 * @version 1.3.0
 * @description Modifiable. Machine properties
 *              
 * @param {object} descriptor Machine descriptor object
 */
function Machine(descriptor, changeReferenceCallback){
    Modifiable.call(this)
    Collectable.call(this, descriptor==null ? JSON.parse(require('../defaults.js').machineDescriptor) : descriptor, changeReferenceCallback)
    
    /**
     * @type {NetworkSettings}
     * @description Access network settings for the machine
     * @memberof Machine
     */
    this.networkSettings = new NetworkSettings(this.descriptor["network_settings"])
    
    /**
     * @type {Provisions}
     * @description Access provisions for the machine
     * @memberof Machine
     */
    this.provisions = new Provisions(this.descriptor["provisions"])
    
    /**
     * @type {InstalledPrograms}
     * @description Access installed programs on the machine
     * @memberof Machine
     */
    this.programs = new InstalledPrograms(this.descriptor["programs"])
    
    // Special properties
    this.sharedFolders = new Set()
    this.extractSharedFoldersFromDescriptor()
    
}

/**
 * @function hold
 * @description Makes this instance of a machine available on the global pocket
 * @memberof Machine
 */
Machine.prototype.hold = function(){
    pocket = this
}

/**
 * @function getDescriptor
 * @description Returns the local descriptor
 * @memberof Machine
 *              
 * @returns {object} Local machine descriptor
 */
//Machine.prototype.getDescriptor = function(){
//    //Update shared folders
//    this.descriptor["sharedFolders"] = this.getSharedFolders()
//    
//    return this.super.getDescriptor()
//}

// === NAME
/**
 * @function getName
 * @memberof Machine
 * @returns {string} Current internal name of the machine
 */
Machine.prototype.getName

/**
 * @function setName
 * @description Set the internal name of the machine
 *              To rename the machine internally and externally, call rename() instead
 * @private
 * @memberof Machine
 * @param {string} name
 */
Machine.prototype.setName

/**
 * @function rename
 * @description Asks the parent of the machine to change name externally
 * @memberof Machine
 * @param {string} newName
 */
//Machine.prototype.rename = function(newName){
//    try{
//        this.externalRename(this.getName(), newName)
//    }catch{
//        console.log("Unable to call external rename")
//        console.log(this.externalRename)
//    }
//}

// === BOX

/**
 * @function getBox
 * @memberof Machine
 * @returns {string}
 */
Machine.prototype.getBox = function(){
    return this.descriptor["box"]
}

/**
 * @function setBox
 * @memberof Machine
 * @param {string} box
 */
Machine.prototype.setBox = function(box){
    this.descriptor["box"] = box
}

// === OS

/**
 * @function getOs
 * @memberof Machine
 * @returns {string}
 */
Machine.prototype.getOs = function(){
    return this.descriptor["os"]
}

/**
 * @function setOs
 * @memberof Machine
 * @param {string} os
 */
Machine.prototype.setOs = function(os){
    this.descriptor["os"] = os
}

// === Type
/**
 * @function getIsAttacker
 * @description Returns flag indicating if machine is attacker
 * @memberof Machine
 * @returns {boolean} Attacker type flag
 */
Machine.prototype.getIsAttacker = function(){
    return this.descriptor["is_attacker"]
}

/**
 * @function setIsAttacker
 * @description Set flag indicating if machine is attacker
 *              To set machine as victim pass false
 * @memberof Machine
 * @param {boolean} isAttacker
 */
Machine.prototype.setIsAttacker = function(isAttacker){
    this.descriptor["is_attacker"] = isAttacker
}

// === GUI
/**
 * @function getGui
 * @memberof Machine
 * @returns {boolean}
 */
Machine.prototype.getGui = function(){
    return this.descriptor["gui"]
}

/**
 * @function setGui
 * @memberof Machine
 * @param {boolean} gui
 */
Machine.prototype.setGui = function(gui){
    this.descriptor["gui"] = gui
}

// === BASE MEMORY
/**
 * @function getBaseMemory
 * @memberof Machine
 * @returns {number}
 */
Machine.prototype.getBaseMemory = function(){
    return parseInt(this.descriptor["base_memory"])
}

/**
 * @function setBaseMemory
 * @memberof Machine
 * @param {number} baseMemory
 */
Machine.prototype.setBaseMemory = function(baseMemory){
    this.descriptor["base_memory"] = baseMemory.toString()
}

// === PROCESSORS
/**
 * @function getProcessors
 * @memberof Machine
 * @returns {number}
 */
Machine.prototype.getProcessors = function(){
    return parseInt(this.descriptor["processors"])
}

/**
 * @function setProcessors
 * @memberof Machine
 * @param {number} processors
 */
Machine.prototype.setProcessors = function(processors){
    this.descriptor["processors"] = processors.toString()
}

//=============================================================================================
//=== Shared Folders
//=============================================================================================

/**
 * @function extractSharedFoldersFromDescriptor
 * @description Called by constructor. Copies shared folders from the descriptor into local set
 * @memberof Machine
 * @private
 */
Machine.prototype.extractSharedFoldersFromDescriptor = function(){
    this.sharedFolders.clear()
    this.descriptor["shared_folders"].forEach(function(path){
        this.sharedFolders.add(path)
    }.bind(this))
}

/**
 * @function setSharedFolders
 * @description Overwrites current list of shared folders with a new one
 * @memberof Machine
 * @param {string[]} sharedFolders Array of strings of shared folder paths
 */
Machine.prototype.setSharedFolders = function(sharedFolders){
    this.sharedFolders.clear()
    sharedFolders.forEach(function(sharedFolder){
        this.sharedFolders.add(sharedFolder)
    }.bind(this))
    // Update descriptor
    this.descriptor["sharedFolders"] = sharedFolders
}

/**
 * @function addSharedFolder
 * @description Adds a shared folder path to the current list
 * @memberof Machine
 * @param {string} location Shared folder path
 */
Machine.prototype.addSharedFolder = function(path){
    this.sharedFolders.add(path)
    // Update descriptor
    this.descriptor["sharedFolders"] = this.getSharedFolders()
}

/**
 * @function removeSharedFolder
 * @description Removed the path of a shared folder from the list
 * @memberof Machine
 * @param   {string} path Path to shared folder to remove
 * @returns {boolean} Deletion result
 */
Machine.prototype.removeSharedFolder = function(path){
    if (this.sharedFolders.delete(path)){
        // Update descriptor
        this.descriptor["sharedFolders"] = this.getSharedFolders()
        return true
    }
    
    return false
}

/**
 * @function getSharedFolders
 * @description Returns array of strings indicating the paths of shared folders
 * @memberof Machine
 * @returns {string[]} Array of strings indicating the paths of shared folders
 */
Machine.prototype.getSharedFolders = function(){
    let sharedFolders = []
    this.sharedFolders.forEach(function(path){
        sharedFolders.push(path)
    }.bind(this))
    return sharedFolders
}



module.exports.Machine = Machine