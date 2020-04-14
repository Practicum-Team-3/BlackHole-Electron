const { session } = require('electron')
var Modifiable = require('./core/modifiable.js').Modifiable
var Loadable = require('./core/loadable.js').Loadable
var NextcloudManager = require('./cloud/nextcloud.js').NextcloudManager
/**
 * @class Programs
 * @version 0.3.0
 * @description Modifiable. Bridged. Available programs
 *              
 * @param {string} descriptor Program descriptor (JSON)
 */
function Programs(widowSettings){
    Modifiable.call(this)
    //Loadable.call(this, "/programs/all")
    this.programs = []
    var registryLocation = "programs/program-registry.json"
    
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
            console.log("LD1")
            this.cloud.download(registryLocation)
            .then(function(response){
                console.log("LD2")
            }).catch(function(error){
                console.log("LE1")
                // Load of the registry failed, maybe cloud needs init
                if (error.response==null || error.response.status!=404){
                    console.log("LE2")
                    // No hope for this, probably can't find cloud
                    reject()
                }else{
                    console.log("LE3")
                    // 404 -> Just need to init the cloud for handling programs
                    this.initCloud()
                    .then(function(){
                        console.log("LE4")
                        resolve()
                    })
                    .catch(function(){
                        console.log("LE5")
                        reject()
                    })
                }
            }.bind(this))
        }.bind(this))
    }
    
    this.initCloud = function(){
        console.log("LE6")
        console.log(this)
        return new Promise(function(resolve, reject){
            console.log("LE7")
            console.log(this)
            this.cloud.createFolder("programs")
            .then(function(){
                console.log("LE8")
                return this.saveRegistry()
            }.bind(this)).then(function(){
                console.log("LE9")
                resolve()
            }).catch(function(){
                console.log("LE10")
                reject()
            })
            
        }.bind(this))
    }
    
    this.saveRegistry = function(){
        console.log("SV1")
        return this.cloud.upload(JSON.stringify(this.programs), registryLocation)
    }
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

Programs.prototype.addProgram = function(buffer, name, os, description, isExploit, axiosBridge, uploadProgressCallback){
    
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
//            var program = new Program()
//            // Customize
//            program.name = name
//            program.setOs(os)
//            program.setDescription(description)
//            program.setIsExploit(isExploit)
//            this.programs[name] = program
            
            resolve()
            return response;
        }, function (error) {

            console.log(error)
            reject()
            return Promise.reject(error);
        });
    }.bind(this))
    
    // Make request for upload
    axiosRequest({
        method: 'put',
        url: this.getCloudAddress()+encodeURIComponent(name),
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

//=========================
// Single Program
//=========================
/**
 * @class Program
 * @description Single instance of a program available on Black Widow
 * @param {object} descriptor Program descriptor object
 */
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