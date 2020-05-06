const Modifiable = require('./core/modifiable.js').Modifiable
const Collectionist = require('./core/collectionist.js').Collectionist
const Collectable = require('./core/collectionist.js').Collectable
const NextcloudManager = require('./cloud/nextcloud.js').NextcloudManager
const UploadReceiver = require('./cloud/upload_receiver.js').UploadReceiver
const crypto = require('crypto')
/**
 * @class Programs
 * @version 1.0.0
 * @description Modifiable. Collectionist. UploadReceiver. Available programs
 *              
 * @param {string} descriptor Program descriptor (JSON)
 */
function Programs(widowSettings){
    Modifiable.call(this)
    
    var widowSettings = widowSettings
    var registryLocation = "programs/registry.json"
    var uploadLocation = "programs/bin/"
    this.descriptor = []
    
    // Inherit from Collectionist and pass empty descriptor object
    Collectionist.call(this, this.descriptor, Program)
    
    
    this.cloud = new NextcloudManager(widowSettings)
    
    // Inherit from UploadReceiver
    UploadReceiver.call(this, this.cloud, uploadLocation)
    
    this.getAddress = function(){
        return widowSettings.getAddress()
    }
    this.getCloudAddress = function(){
        return widowSettings.getCloudAddress()
    }
    this.getUploadLocation = function(){
        return uploadLocation
    }
    
    /**
     * @function load
     * @memberof Programs
     * @description Performs loading of the registry, or cloud initialization upon a 404
     * @returns {Promise} Promise for the completion of the loading/inititalization
     */
    this.load = function(){
        return new Promise(function(resolve, reject){
            //this.programs["e0"] = new Program()
            console.log("fetching registry...")
            this.cloud.download(registryLocation)
            .then(function(response){
                
                // Put response on descriptor
                this.super.setDescriptor(response.data)
                
                resolve()
                
            }.bind(this)).catch(function(error){
                console.log("unable to fetch registry")
                // Load of the registry failed, maybe cloud needs init
                if (error.response==null || error.response.status!=404){
                    // No hope for this, probably can't find cloud
                    console.log("fatal, unable to recover")
                    console.log(error)
                    reject()
                }else{
                    console.log("failed with (404): performing registry setup...")
                    // 404 -> Just need to init the cloud for handling programs
                    initCloud()
                    .then(function(){
                        resolve()
                    })
                    .catch(function(){
                        reject()
                    })
                }
            }.bind(this))
        }.bind(this))
    }
    
    /**
     * @function initCloud
     * @private
     * @description Performs the initialization of the file structure required on the cloud
     * @returns {Promise} Promise for the completion of the initialization
     */
    var initCloud = function(){
        
        return new Promise(function(resolve, reject){
            console.log("::mkdir programs")
            // Create main dir
            this.cloud.createFolder("programs")
            .then(function(){
                // Save registry
                return saveRegistry()
                
            }.bind(this)).then(function(){
                console.log("::mkdir bin")
                // Create bin directory
                return this.cloud.createFolder(uploadLocation)
                
            }.bind(this)).then(function(){
                resolve()
            }).catch(function(){
                reject()
            })
        }.bind(this))
    }.bind(this)
    
    /**
     * @function saveRegitry
     * @private
     * @description Saves the current status of the regitry back to the cloud
     * @returns {Promise} Promise for the completion of the saving process
     */
    var saveRegistry = function(){
        console.log("saving registry...")
        return this.cloud.upload(JSON.stringify(this.descriptor), registryLocation)
    }.bind(this)
    
    
    /**
     * @function removeProgram
     * @memberof Programs
     * @description Removes a program from Widow
     * @param   {Program} program Instance of a program to remove
     * @returns {Promise} Promise for the completion of the removal process
     */
    this.removeProgram = function(program){
        // Delete the file
        return this.cloud.delete(uploadLocation+program.getName()).then(function(){
            
            // Remove from collection
            this.super.remove(program)
            
            // Save registry, and return promise
            return saveRegistry()
        }.bind(this))
    }
    
    /**
     * @function uploadComplete
     * @memberof Programs
     * @description When the upload of a program is completed, this function allows for it's inclusion into the list.
     * @param   {string}    name       Filename of the program that was uploaded
     * @param   {string}    hash       Hash of the program
     * @param   {any[]}     properties Properties of the program (OS, description, isExploit)
     */
    this.uploadComplete = function(name, hash, properties){
        return new Promise(function(resolve, reject){
            // Create default instance of Program
            var program = new Program()
            // Customize
            program.setName(name)
            program.setHash(hash)
            program.setOs(properties[0])
            program.setDescription(properties[1])
            program.setIsExploit(properties[2])

            //Add without duplicates, but with replacements
            var addSuccess = this.super.add(program, false, true)
            if (!addSuccess){
                reject()
            }

            //Save descriptor
            saveRegistry()
            .then(function(){
                resolve(program)
            }).catch(function(){
                reject()
            })
        }.bind(this))
    }
    
    /**
     * @function getListOfFilesWithHash
     * @memberof Programs
     * @param   {string} hash Hash to match programs to
     * @returns {Program[]} List of program objects that match the hash
     */
    this.getListOfFilesWithHash = function(hash){
        return this.super.getCollectablesByCharacteristic("getHash", hash)
    }
}

/**
 * @function getProgramNamesList
 * @description Returns an array with strings of the program names
 * @memberof Programs
 * @returns {string[]} Array with program names as strings
 */
Programs.prototype.getProgramNamesList = function(){
    return this.super.getNamesList()
}

Programs.prototype.getProgramByName = function(programName){
    return this.super.getCollectablesByName(programName)[0]
}

Programs.prototype.getAllExploits = function(){
    return this.super.getCollectablesByCharacteristic("getIsExploit", true)
}

Programs.prototype.getAllNonExploits = function(){
    return this.super.getCollectablesByCharacteristic("getIsExploit", false)
}



//=========================
// Single Program
//=========================
/**
 * @class Program
 * @description Single instance of a program available on Black Widow
 * @param {object} descriptor Program descriptor object
 */
function Program(descriptor){
    Collectable.call(this, descriptor==null ? JSON.parse(require('./defaults.js').programDescriptor) : descriptor)
}

// === NAME
/**
 * @function setName
 * @memberof Program
 * @param {string} name
 */
Program.prototype.setName
/**
 * @function getName
 * @memberof Program
 * @returns {string}
 */
Program.prototype.getName

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

// === HASH
/**
 * @function setHash
 * @memberof Program
 * @param {string} Hexadecimal hash
 */
Program.prototype.setHash = function(hash){
    this.descriptor["hash"] = hash
}
/**
 * @function getHash
 * @memberof Program
 * @returns {string}
 */
Program.prototype.getHash = function(){
    return this.descriptor["hash"]
}


module.exports.Programs = Programs