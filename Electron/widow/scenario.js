

function Scenario(descriptor){
    this.descriptor = descriptor
    this.machineNameList = null
    this.machines = {}
    
    // Create machine objects from the descriptor
    this.createMachinesFromDescriptor()
}

// === NAME
Scenario.prototype.getName = function(){
    return this.descriptor["scenario_name"]
}

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

// === Machines
Scenario.prototype.getMachineNamesList = function(id){
    return this.machineNameList
}

/*========================*/
/*=== Internal Machine Handling
/*========================*/
Scenario.prototype.createMachinesFromDescriptor = function(){
    var Machine = require('./machine.js').Machine
    
    for (machineName in this.descriptor["machines"]){
        this.machines[machineName] = new Machine(this.descriptor["machines"][machineName])
    }
}

module.exports.Scenario = Scenario