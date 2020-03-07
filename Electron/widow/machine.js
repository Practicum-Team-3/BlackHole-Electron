

function Machine(descriptor){
    this.descriptor = descriptor==null ? JSON.parse(require('./defaults.js').machineDescriptor) : descriptor
    
    this.networkSettings = {}
    
    // Special properties
    this.sharedFolders = new Set()
}

// === NAME
Machine.prototype.getName = function(){
    return this.descriptor["name"]
}
// Set the internal name of the machine
// (discouraged) rename machine from scenario instead
Machine.prototype.setName = function(name){
    this.descriptor["name"] = name
}

// === ID
Machine.prototype.getOs = function(){
    return this.descriptor["os"]
}

Machine.prototype.setOs = function(id){
    this.descriptor["os"] = id
}

// === Type
Machine.prototype.getIsAttacker = function(id){
    return this.descriptor["is_attacker"]
}


module.exports.Machine = Machine