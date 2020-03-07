var Machine = require('./machine.js').Machine

function Scenario(descriptor){
    this.descriptor = descriptor==null ? JSON.parse(require('./widowDefaults.js').scenarioDescriptor) : descriptor
    this.machines = {}
    
    // Create machine objects from the descriptor
    this.createMachinesFromDescriptor()
}

// === NAME
Scenario.prototype.getName = function(){
    return this.descriptor["scenario_name"]
}

/**
 * setName()
 * Do not use.
 * Set the name of a scenario instead by calling renameScenario() on Scenarios
 *
 * @private
 */
Scenario.prototype.setName = function(name){
    this.descriptor["scenario_name"] = name
}

// === ID
Scenario.prototype.getId = function(){
    return this.descriptor["scenario_id"]
}

Scenario.prototype.setId = function(id){
    this.descriptor["scenario_id"] = id
}

//========================
//=== Machines
//========================
/**
 * getMachineNamesList()
 * Get a list with the names of the available machines
 *
 * @return {string[]} Array of strings of machine names
 */
Scenario.prototype.getMachineNamesList = function(){
    let machineNameList = []
    for (machineName in this.machines){
        machineNameList.push(machineName)
    }
    return machineNameList
}

// Creates a new default machine instance, adds it to the current list of machines and returns it
// Pass the name of the new machine
Scenario.prototype.newMachine = function(machineName){
    let newMachine = new Machine()
    newMachine.setName(machineName)
    this.addMachine(newMachine)
    return newMachine
}

// Renames a machines and also updates the internal name
Scenario.prototype.renameMachine = function(oldName, newName){
    if (this.machines[oldName]!=null){
        let machine  = this.machines[oldName]
        this.removeMachineByName(oldName)
        machine.setName(newName)
        this.addMachine(machine)
    }
}

// Get a list of all attacker machine objects
Scenario.prototype.getAllAttackerMachines = function(){
    return this.getMachinesByTypeAttacker(true)
}

// Get a list of all victim machine objects
Scenario.prototype.getAllVictimMachines = function(){
    return this.getMachinesByTypeAttacker(false)
}


//========================
//=== Internal Machine Handling (TODO: make private?)
//========================

// Geneare the machines included in the descriptor
Scenario.prototype.createMachinesFromDescriptor = function(){
    
    for (machineName in this.descriptor["machines"]){
        this.addMachine(new Machine(this.descriptor["machines"][machineName]))
    }
}

// Add machine
Scenario.prototype.addMachine = function(machine){
    this.machines[machine.getName()] = machine
}

// Remove machine
Scenario.prototype.removeMachineByName = function(machineName){
    delete this.machines[machineName]
}

// Get all machines of a certain type. Pass true for attacker type, otherwise pass false
Scenario.prototype.getMachinesByTypeAttacker = function(shouldBeAttacker){
    let extracted = []
    
    for (machineName in this.machines){
        if (this.machines[machineName].getIsAttacker()==shouldBeAttacker){
            extracted.push(this.machines[machineName])
        }
    }
    
    return extracted
}

module.exports.Scenario = Scenario