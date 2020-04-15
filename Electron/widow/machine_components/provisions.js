var Collectionist = require('../core/collectionist.js').Collectionist
var Collectable = require('../core/collectionist.js').Collectable
/**
 * @class Provisions
 * @version 2.0.0
 * @param {object} descriptor Provisions descriptor object
 */
function Provisions(descriptor){
    Collectionist.call(this, descriptor, Provision)
}

/**
 * @function getAllProvisions
 * @description Returns array with all provisions
 * @memberof Provisions
 * @returns {Provision[]} Array of Provision objects
 */
Provisions.prototype.getAllProvisions = function(){
    return this.super.getAll()
}

/**
 * @function getProvisionsByName
 * @description Returns all provisions with a speficied name
 * @memberof Provisions
 * @param   {string} name Name to match
 * @returns {Provision[]} Array of Provision objects
 */
Provisions.prototype.getProvisionsByName = function(name){
    return this.super.getCollectablesByName(name)
}

/**
 * @function addProvision
 * @description Creates and adds a provision with specified information
 * @memberof Provisions
 * @param {string} name          Name of the provision
 * @param {string} provisionType Type of the provision
 * @param {string[]} commands    Array of strings for the commands
 */
Provisions.prototype.addProvision = function(name, provisionType, commands){
    var provision = new Provision()
    provision.setName(name)
    provision.setProvisionType(provisionType)
    provision.setCommands(commands)
    
    this.super.add(provision)
}

/**
 * @function removeProvision
 * @description Removes instance of Provision
 * @memberof Provisions
 * @param {Provision} provision Instance of Provision to remove
 * @returns {boolean} Success of the removal
 */
Provisions.prototype.removeProvision = function(provision){
    return this.super.remove(provision)
}

module.exports.Provisions = Provisions

//====================
//=== Provision
//====================
/**
 * @class Provision
 * @version 1.0.0
 * @param {Object} descriptor Single provision
 */
function Provision(descriptor){
    Collectable.call(this, descriptor==null ? JSON.parse(require('../defaults.js').provisionDescriptor) : descriptor)
}

// === Name
/**
 * @function setName
 * @memberof Provision
 * @param {string} name
 */
Provision.prototype.setName

/**
 * @function getName
 * @memberof Provision
 * @returns {string}
 */
Provision.prototype.getName

// === Provision type
/**
 * @function setProvisionType
 * @memberof Provision
 * @param {string} provisionType
 */
Provision.prototype.setProvisionType = function(provisionType){
    this.descriptor["provision_type"] = provisionType
}

/**
 * @function getProvisionType
 * @memberof Provision
 * @returns {string}
 */
Provision.prototype.getProvisionType = function(){
    return this.descriptor["provision_type"]
}

// === Commands
/**
 * @function setCommands
 * @memberof Provision
 * @param {string[]} commands Array of string commands
 */
Provision.prototype.setCommands = function(commands){
    this.descriptor["commands"] = commands
}
/**
 * @function getCommands
 * @memberof Provision
 * @returns {string[]} Current array of string commands
 */
Provision.prototype.getCommands = function(){
    return this.descriptor["commands"]
}