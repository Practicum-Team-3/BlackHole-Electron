const { session } = require('electron')
const Modifiable = require('./core/modifiable.js').Modifiable
const Collectionist = require('./core/collectionist.js').Collectionist
const Collectable = require('./core/collectionist.js').Collectable
const NextcloudManager = require('./cloud/nextcloud.js').NextcloudManager
/**
 * @class Programs
 * @version 0.3.0
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
            
            this.cloud.download(registryLocation)
            .then(function(response){
                
                // Put response on descriptor
                this.super.setDescriptor(response.data)
                
                resolve()
                
            }.bind(this)).catch(function(error){
                
                // Load of the registry failed, maybe cloud needs init
                if (error.response==null || error.response.status!=404){
                    // No hope for this, probably can't find cloud
                    reject()
                }else{
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
            // Create main dir
            this.cloud.createFolder("programs")
            .then(function(){
                // Save registry
                return this.saveRegistry()
                
            }.bind(this)).then(function(){
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
        
        return this.cloud.upload(JSON.stringify(this.descriptor), registryLocation)
    }
    
    /**
     * @function addProgram
     * @param   {[[Type]]} buffer                 [[Description]]
     * @param   {[[Type]]} name                   [[Description]]
     * @param   {object}   os                     [[Description]]
     * @param   {[[Type]]} description            [[Description]]
     * @param   {[[Type]]} isExploit              [[Description]]
     * @param   {object}   axiosBridge            [[Description]]
     * @param   {[[Type]]} uploadProgressCallback [[Description]]
     * @returns {Promise} Promise for the program upload process. Passes the instance of the
     *                    added program when resolved
     */
    this.addProgram = function(buffer, name, os, description, isExploit, axiosBridge, uploadProgressCallback){

        // Prepare axios instance in case a bridge was omited
        var axios = require('axios').create()

        // Prepare axios' methods from either the bridge or the local nodejs instance
        var axiosRequest = axiosBridge.request!=null ? axiosBridge.request : axios.request
        var responseUse = axiosBridge.responseUse!=null ? axiosBridge.responseUse : axios.interceptors.response.use

        // Prepare promise to return to caller
        var uploadPromise = new Promise(function(resolve, reject){
            responseUse(function (response) {
                // Need to delete cookies because Nextcloud sends back stuff it can't handle itself
                session.defaultSession.clearStorageData(["cookies"])

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

                return response;
            }.bind(this), function (error) {

                console.log(error)
                reject()
                return Promise.reject(error);
            }.bind(this));
        }.bind(this))

        // Make request for upload
        axiosRequest({
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
                    console.log("Skipping upload progress")
                }

            },
            data: buffer
        })

        return uploadPromise
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