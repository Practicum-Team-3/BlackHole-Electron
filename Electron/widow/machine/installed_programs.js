var Collectionist = require('../core/collectionist.js').Collectionist
var Collectable = require('../core/collectionist.js').Collectable
/**
 * @class InstalledPrograms
 * @version 2.0.0
 * @param {object} descriptor Programs descriptor object
 */
function InstalledPrograms(descriptor){
    Collectionist.call(this, descriptor, InstalledProgram)
}

/**
 * @function getProgramNamesList
 * @description Returns an array with strings of the program names
 * @memberof InstalledPrograms
 * @returns {string[]} Array with program names as strings
 */
InstalledPrograms.prototype.getProgramNamesList = function(){
    return this.super.getNamesList()
}

/**
 * @function getAllPrograms
 * @description Returns array with the installed programs on the machine
 * @memberof InstalledPrograms
 * @returns {InstalledProgram[]} Array with InstalledPrograms objects
 */
InstalledPrograms.prototype.getAllPrograms = function(){
    return this.super.getAll()
}

/**
 * @function getProgramsByName
 * @description Returns all programs with a speficied name
 * @memberof InstalledPrograms
 * @param   {string} name Name to match
 * @returns {Provision[]} Array of InstalledProgram objects
 */
InstalledPrograms.prototype.getProgramsByName = function(name){
    return this.super.getCollectablesByName(name)
}

/**
 * @function addProgram
 * @description Adds a program to the current list of installed programs
 * @memberof InstalledPrograms
 * @param {string} name     Filename of the program to install
 * @param {string} location Location of the installation in the machines file system
 */
InstalledPrograms.prototype.addProgram = function(name, location){
    var program = new InstalledProgram()
    program.setName(name)
    program.setLocation(location)
    
    // Add, allow duplications
    return this.super.add(program, true)
}

/**
 * @function removeProgram
 * @description Removes instance of InstalledProgram
 * @memberof InstalledPrograms
 * @param   {InstalledProgram} program Instance of InstalledProgram to remove
 * @returns {boolean} Success of the removal
 */
InstalledPrograms.prototype.removeProgram = function(program){
    return this.super.remove(program)
}

module.exports.InstalledPrograms = InstalledPrograms

//==================================================================================================
//=== Installed Program
//==================================================================================================
/**
 * @class InstalledProgram
 * @version 1.1.0
 * @param {Object} descriptor Installed program
 */
function InstalledProgram(descriptor){
    Collectable.call(this, descriptor==null ? JSON.parse(require('../defaults.js').programDescriptor) : descriptor)
}

//==== Name

/**
 * @function getName
 * @memberof InstalledProgram
 * @returns {string} Name of the program (including extension)
 */
InstalledProgram.prototype.getName

/**
 * @function setName
 * @memberof InstalledProgram
 * @param {string} location Name of the program (including extension)
 */
InstalledProgram.prototype.setName

//==== Location

/**
 * @function getLocation
 * @memberof InstalledProgram
 * @returns {string} Location of the installed program in the machine's filesystem
 */
InstalledProgram.prototype.getLocation = function(){
    return this.descriptor["location"]
}

/**
 * @function setLocation
 * @memberof InstalledProgram
 * @param {string} location Location of the installed program in the machine's filesystem
 */
InstalledProgram.prototype.setLocation = function(location){
    this.descriptor["location"] = location
}

module.exports.InstalledProgram = InstalledProgram