const Modifiable = require('./core/modifiable.js').Modifiable
const Collectionist = require('./core/collectionist.js').Collectionist
const Machine = require('./machine/machine.js').Machine
/**
 * @class Machines
 * @description Modifiable. Collectionist. Holds machine instances
 * @version 0.1.0
 */
function Machines(descriptor){
    Modifiable.call(this)
    // Inherit from collectionist and pass empty descriptor object
    Collectionist.call(this, descriptor, Machine)
}

/**
 * @function getMachineNamesList
 * @description Get a list with the names of the available machines
 * @memberof Scenario
 *
 * @return {string[]} Array of strings of machine names
 */
Machines.prototype.getMachineNamesList = function(){
    return this.super.getNamesList()
}

/**
 * @function createNewMachine
 * @description Creates a new default machine instance with default settings,
 *              adds it to the current list of machines and returns it
 * @memberof Scenario
 * @param   {string} machineName Name to give to the new machine
 * @param   {box}    box         Optional: Name of vagrant box to base machine on
 * @returns {Machine} New Machine instance
 */
Machines.prototype.createNewMachine = function(machineName, box){
    
    let newMachine = new Machine(null)
    newMachine.setName(machineName)
    if (box!=undefined){
        newMachine.setBox(box)
    }
    this.super.add(newMachine)
    return newMachine
}


/**
 * @function getAllAttackerMachines
 * @description Get a list of all attacker machine objects
 * @memberof Scenario
 * @returns {Machine[]} Array of attacker machines
 */
Machines.prototype.getAllAttackerMachines = function(){
    return this.super.getCollectablesByCharacteristic("getIsAttacker", true)
}

/**
 * @function getAllVictimMachines
 * @description Get a list of all victim machine objects
 * @memberof Scenario
 * @returns {Machine[]} Array of victim machines
 */
Machines.prototype.getAllVictimMachines = function(){
    return this.super.getCollectablesByCharacteristic("getIsAttacker", false)
}

/**
 * @function getAllMachines
 * @description Returns a list of all machine objects
 * @memberof Scenarios
 * @returns {Machine[]} Array of all machines
 */
Machines.prototype.getAllMachines = function(){
    return this.super.getAll()
}

/**
 * @function getMachineByName
 * @description Returns instance of a machine with a specific name
 * @memberof Scenario
 * @param   {string} machineName Name of the machine to obtain
 * @returns {Machine}
 */
Machines.prototype.getMachineByName = function(machineName){
    return this.super.getCollectableByName(machineName)
}


/**
 * @function removeMachineByName
 * @description Removes a machine from the list and returns it
 * @memberof Scenario
 * @param {string} machineName Name of the machine to remove
 * @returns {Machine} Removed machine
 * @throws Undefined machine
 */
Machines.prototype.removeMachineByName = function(machineName){
    var machineToDelete = this.super.getCollectableByName(machineName)
    if (machineToDelete!=null){
        this.super.remove(machineToDelete)
    }
}

module.exports.Machines = Machines