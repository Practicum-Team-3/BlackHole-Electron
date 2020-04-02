var Modifiable = require('./core/modifiable.js').Modifiable
var Loadable = require('./core/loadable.js').Loadable
/**
 * @class Programs
 * @version 0.2.0
 * @description Modifiable. Available programs
 *              
 * @param {string} descriptor Program descriptor (JSON)
 */
function Programs(widowSettings){
    Modifiable.call(this)
    //Loadable.call(this, "/programs/all")
    
    var widowSettings = widowSettings
    
    this.getAddress = function(){
        return widowSettings.getAddress()
    }
    this.programs = {}
}


Programs.prototype.load = function(){
    return new Promise(function(resolve, reject){
        this.programs["e0"] = new Program()
        this.programs["e0"].setIsExploit(true)
        this.programs["e1"] = new Program()
        this.programs["e1"].setIsExploit(true)
        this.programs["p0"] = new Program()
        resolve()
    }.bind(this))
}

Programs.prototype.getProgramsByTypeExploit = function(shouldBeExploit){
    var programs = {}
    for (programName in this.programs){
        if (shouldBeExploit==null || this.programs[programName].getIsExploit()==shouldBeExploit){
            programs[programName] = (this.programs[programName])
        }
    }
    return programs
}

/**
 * @function getProgramsList
 * @description Returns an array with strings of the program names
 * @memberof Programs
 * @returns {string[]} Array with program names as strings
 */
Programs.prototype.getProgramsList = function(){
    var programList = []
    for (programName in this.programs){
        programList.append(programName)
    }
    return programList
}

Programs.prototype.getProgramByName = function(programName){
    return this.programs[programName]
}

Programs.prototype.getAllExploits = function(){
    return this.getProgramsByTypeExploit(true)
}

Programs.prototype.getAllNonExploits = function(){
    return this.getProgramsByTypeExploit(false)
}

Programs.prototype.addProgram = function(formData, name, description, os, isExploit){
    //return new Promise(function(resolve, reject){
        

        //Get axios in the scene now!
        var axios = require('axios')

        axios.post(this.getAddress()+"/uploadFile", formData)
        .then(function (response) {

            // Create default instance of Program
            var program = new Program()
            // Customize
            program.name = name
            program.setOs(os)
            program.setDescription(description)
            program.setIsExploit(isExploit)
            this.programs[name] = program

            //resolve()

        }.bind(this)).catch(function (error) {
            // handle error
            console.log(error);
            //reject()

        })
    //})
}

//=========================
// Single Program
//=========================
function Program(descriptor){
    this.descriptor = descriptor==null ? JSON.parse(require('./defaults.js').programDescriptor) : descriptor
}

// === OS
/**
 * @function setOs
 * @memberof Program
 * @param {string} os
 */
Program.prototype.setOs = function(os){
    this.descriptor["os"] = os
}
/**
 * @function getOs
 * @memberof Program
 * @returns {string}
 */
Program.prototype.getOs = function(){
    return this.descriptor["os"]
}

// === isExploit

/**
 * @function setIsExploit
 * @memberof Program
 * @param {boolean} isExploit
 */
Program.prototype.setIsExploit = function(isExploit){
    this.descriptor["is_exploit"] = isExploit
}
/**
 * @function getIsExploit
 * @memberof Program
 * @returns {boolean}
 */
Program.prototype.getIsExploit = function(){
    return this.descriptor["is_exploit"]
}

// === Description
/**
 * @function setDescription
 * @memberof Program
 * @param {string} Description
 */
Program.prototype.setDescription = function(description){
    this.descriptor["description"] = description
}
/**
 * @function getDescription
 * @memberof Program
 * @returns {string}
 */
Program.prototype.getDescription = function(){
    return this.descriptor["description"]
}

module.exports.Programs = Programs