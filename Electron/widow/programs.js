const Modifiable = require('./core/modifiable.js').Modifiable
const Collectionist = require('./core/collectionist.js').Collectionist
const Collectable = require('./core/collectionist.js').Collectable
const NextcloudManager = require('./cloud/nextcloud.js').NextcloudManager
/**
 * @class Programs
 * @version 0.4.0
 * @description Modifiable. Collectionist. Available programs
 *              
 * @param {string} descriptor Program descriptor (JSON)
 */
function Programs(widowSettings){
    Modifiable.call(this)
    
    var registryLocation = "programs/registry.json"
    var uploadLocation = "programs/bin/"
    this.descriptor = []
    
    // Inherit from collectionist and pass empty descriptor object
    Collectionist.call(this, this.descriptor, Program)
    
    
    this.cloud = new NextcloudManager(widowSettings)
    var widowSettings = widowSettings
    
    this.getAddress = function(){
        return widowSettings.getAddress()
    }
    this.getCloudAddress = function(){
        return widowSettings.getCloudAddress()
    }
    
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
                    console.log("fatal, unable to recover ")
                    console.log(error)
                    reject()
                }else{
                    console.log("failed with (404): performing registry setup...")
                    // 404 -> Just need to init the cloud for handling programs
                    this.initCloud()
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
    
    this.initCloud = function(){
        
        return new Promise(function(resolve, reject){
            console.log("::mkdir programs")
            // Create main dir
            this.cloud.createFolder("programs")
            .then(function(){
                // Save registry
                return this.saveRegistry()
                
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
    }
    
    this.saveRegistry = function(){
        console.log("saving registry")
        return this.cloud.upload(JSON.stringify(this.descriptor), registryLocation)
    }
    
    /**
     * @function addProgram
     * @description Uploads a program into Black Widow
     * @memberof Program
     * @param   {ArrayBuffer} buffer                 Byte array of the file
     * @param   {string} name                   Name of the file
     * @param   {string}   os                   Operating system target
     * @param   {string} description            Description of the program
     * @param   {boolean} isExploit             Pass true if program is an exploit
     * @param   {function} uploadProgressCallback Callback to update on the upload progress, should accept two int parameters: upload progress, upload total.
     * @returns {Promise} Promise for the program upload process. Passes the instance of the
     *                    added program when resolved
     */
    this.addProgram = function(buffer, name, os, description, isExploit, uploadProgressCallback){

        // Prepare promise to return to caller
        return new Promise(function(resolve, reject){
            
            axiosBridged({
                method: 'put',
                url: this.getCloudAddress()+uploadLocation+encodeURIComponent(name),
                auth: {
                    username: 'admin',
                    password: 'password'
                },
                onUploadProgress: function (progressEvent) {

                    try{
                        uploadProgressCallback(progressEvent.loaded, progressEvent.total)
                    }catch{
                        console.log("::Skipping upload progress")
                    }
                },
                data: buffer
            }, function (response) {
                

                // Create default instance of Program
                var program = new Program()
                // Customize
                program.setName(name)
                program.setOs(os)
                program.setDescription(description)
                program.setIsExploit(isExploit)

                //Add without duplicates
                this.super.add(program, false)

                //Save descriptor
                this.saveRegistry()
                .then(function(){
                    resolve(program)
                }).catch(function(){
                    reject()
                })

            }.bind(this), function (error) {

                console.log(error)
                reject()
            }.bind(this))
            
        }.bind(this))
    }
    
    this.removeProgram = function(program){
        // Delete the file
        return this.cloud.delete(uploadLocation+program.getName()).then(function(){
            
            // Remove from collection
            this.super.remove(program)
            
            // Save registry, and return promise
            return this.saveRegistry()
        }.bind(this))
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


module.exports.Programs = Programs