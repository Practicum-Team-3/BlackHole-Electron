var Modifiable = require('./core/modifiable.js').Modifiable
var Loadable = require('./core/loadable.js').Loadable
/**
 * @class Programs
 * @version 0.1.0
 * @description Modifiable. Available programs
 *              
 * @param {string} descriptor Program descriptor (JSON)
 */
function Programs(widowSettings){
    Modifiable.call(this)
    Loadable.call(this, "/programs/all")
}


/**
 * @function getProgramsList
 * @description Returns an array with strings of the program names
 * @memberof Programs
 * @returns {string[]} Array with program names as strings
 */
Programs.prototype.getProgramsList = function(){
    return this.getItemList()
}

Programs.prototype.getProgramByName = function(programName){
    
}

Programs.prototype.getAllExploits = function(){
    
}

Programs.prototype.getAllVulnerablePrograms = function(){
    
}

Programs.prototype.uploadProgram = function(){
    
}


module.exports.Programs = Programs