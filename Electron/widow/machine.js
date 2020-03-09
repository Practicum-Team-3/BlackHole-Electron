
/**
 * @class Machine
 * @version 1.0.0
 * @description Machine properties
 *              
 * @param {string} descriptor Machine descriptor (JSON)
 */
function Machine(descriptor){
    this.descriptor = descriptor==null ? JSON.parse(require('./defaults.js').machineDescriptor) : descriptor
    
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
    
    // Special properties
    this.sharedFolders = new Set()
    this.extractSharedFoldersFromDescriptor()
}

/**
 * @function getDescriptorAsString
 * @description Generate and return the updated descriptor (JSON)
 * @memberof Machine
 * @todo Complete implementation
 *              
 * @returns {string} String representation of the machine descriptor
 */
Machine.prototype.getDescriptorAsString = function(){
    //Update shared folders
    this.descriptor["sharedFolders"] = this.getSharedFolders()
    
    let stringDescriptor = JSON.stringify(this.descriptor)
    
    return stringDescriptor
}

// === NAME
/**
 * @function getName
 * @memberof Machine
 * @returns {string} Current internal name of the machine
 */
Machine.prototype.getName = function(){
    return this.descriptor["name"]
}

/**
 * @function setName
 * @description Set the internal name of the machine
 *              (discouraged) rename machine from scenario instead
 * @private
 * @memberof Machine
 * @param {string} name
 */
Machine.prototype.setName = function(name){
    this.descriptor["name"] = name
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

//========================
//=== Shared Folders
//========================

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
}

/**
 * @function addSharedFolder
 * @description Adds a shared folder path to the current list
 * @memberof Machine
 * @param {string} location Shared folder path
 */
Machine.prototype.addSharedFolder = function(path){
    this.sharedFolders.add(path)
}

/**
 * @function removeSharedFolder
 * @description Removed the path of a shared folder from the list
 * @memberof Machine
 * @param   {string} path Path to shared folder to remove
 * @returns {boolean} Deletion result
 */
Machine.prototype.removeSharedFolder = function(path){
    return this.sharedFolders.delete(path)
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


//========================
//=== Network Settings
//========================
/**
 * @class NetworkSettings
 * @version 1.0.0
 * @param {Object} descriptor Network descriptor object
 */
function NetworkSettings(descriptor){
    this.descriptor = descriptor
}

/**
 * @function setNetworkName
 * @description Set the network name
 * @memberof NetworkSettings
 * @param {string} networkName Name to give the network
 */
NetworkSettings.prototype.setNetworkName = function(networkName){
    this.descriptor["network_name"] = networkName
}

/**
 * @function getNetworkName
 * @description Returns the current name of the network
 * @memberof NetworkSettings
 * @returns {string} Current name of the network
 */
NetworkSettings.prototype.getNetworkName = function(){
    return this.descriptor["network_name"]
}

//== Network Type
/**
 * @function setNetworkType
 * @memberof NetworkSettings
 * @param {string} networkType Type of the network
 */
NetworkSettings.prototype.setNetworkType = function(networkType){
    this.descriptor["network_type"] = networkType
}

/**
 * @function getNetworkType
 * @memberof NetworkSettings
 * @returns {string} Network type
 */
NetworkSettings.prototype.getNetworkType = function(){
    return this.descriptor["network_type"]
}

//== IP Address
/**
 * @function setIpAddress
 * @memberof NetworkSettings
 * @param {string} ipAddress IP Address of the machine
 */
NetworkSettings.prototype.setIpAddress = function(ipAddress){
    this.descriptor["ip_address"] = ipAddress
}

/**
 * @function getIpAddress
 * @memberof NetworkSettings
 * @returns {string} IP Address of the machine
 */
NetworkSettings.prototype.getIpAddress = function(){
    return this.descriptor["ip_address"]
}

//== Auto config
/**
 * @function setAutoConfig
 * @memberof NetworkSettings
 * @param {boolean} autoConfig Boolean for automatic configuration
 */
NetworkSettings.prototype.setAutoConfig = function(autoConfig){
    this.descriptor["auto_config"] = autoConfig
}

/**
 * @function getAutoConfig
 * @memberof NetworkSettings
 * @returns {boolean} Boolean for automatic configuration
 */
NetworkSettings.prototype.getAutoConfig = function(){
    return this.descriptor["auto_config"]
}

//========================
//=== Provisions
//========================
/**
 * @class Provisions
 * @version 1.0.0
 * @param {Object} descriptor Provisions descriptor object
 */
function Provisions(descriptor){
    this.descriptor = descriptor
}

// === Name
/**
 * @function setName
 * @memberof Provisions
 * @param {string} name
 */
Provisions.prototype.setName = function(name){
    this.descriptor["name"] = name
}

/**
 * @function getName
 * @memberof Provisions
 * @returns {string}
 */
Provisions.prototype.getName = function(){
    return this.descriptor["name"]
}

// === Provision type
/**
 * @function setProvisionType
 * @memberof Provisions
 * @param {string} provisionType
 */
Provisions.prototype.setProvisionType = function(provisionType){
    this.descriptor["provision_type"] = provisionType
}

/**
 * @function getProvisionType
 * @memberof Provisions
 * @returns {string}
 */
Provisions.prototype.getProvisionType = function(){
    return this.descriptor["provision_type"]
}

// === Commands
/**
 * @function setCommands
 * @memberof Provisions
 * @param {string[]} commands Array of string commands
 */
Provisions.prototype.setCommands = function(commands){
    this.descriptor["commands"] = commands
}
/**
 * @function getCommands
 * @memberof Provisions
 * @returns {string[]} Current array of string commands
 */
Provisions.prototype.getCommands = function(){
    return this.descriptor["commands"]
}


module.exports.Machine = Machine