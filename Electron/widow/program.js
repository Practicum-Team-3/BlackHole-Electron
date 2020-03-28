var Modifiable = require('./core/modifiable.js').Modifiable

/**
 * @class Machine
 * @version 1.0.0
 * @description Program properties
 *              
 * @param {string} descriptor Program descriptor (JSON)
 */
function Program(descriptor){
    Modifiable.call(this)
    
    this.descriptor = descriptor==null ? JSON.parse(require('./defaults.js').machineDescriptor) : descriptor
    
    
}



/**
 * @function getDescriptorAsString
 * @description Generate and return the updated descriptor (JSON)
 * @memberof Progran
 * @todo Complete implementation
 *              
 * @returns {string} String representation of the program descriptor
 */
Machine.prototype.getDescriptorAsString = function(){
    
    let stringDescriptor = JSON.stringify(this.descriptor)
    
    return stringDescriptor
}

// === NAME
/**
 * @function getName
 * @memberof Program
 * @returns {string} Current internal name of the machine
 */
Machine.prototype.getName = function(){
    return this.descriptor["name"]
}

/**
 * @function setName
 * @description Set the internal name of the program
 * @private
 * @memberof Program
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




module.exports.Program = Program