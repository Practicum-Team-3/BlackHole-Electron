

function Machine(descriptor){
    this.descriptor = descriptor
    
}

// === NAME
Machine.prototype.getName = function(){
    return this.descriptor["name"]
}

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


module.exports.Machine = Machine