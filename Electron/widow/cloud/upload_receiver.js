/**
 * @class UploadReceiver
 * @version 1.0.0
 * @description Prototype for a class that can allow and receive notifications for file uploads through the file upload helper
 */
function UploadReceiver(cloud, uploadLocation){
    /**
     * @function getUploadConfigForFile
     * @memberof UploadReceiver
     * @description Inherited directly.
     *                  Returns the axios configuration object for uploading a file with a specific name
     * @param {[[Type]]} uploadingFileName [[Description]]
     */
    this.getUploadConfigForFileWithName = function(uploadingFileName){
        return cloud.getUploadConfig(uploadLocation+uploadingFileName)
    }
    
    /**
     * @function uploadComplete
     * @memberof UploadReceiver
     * @description Prototype.
     *                  Override with custom implementation to get notified of a file upload completion
     * @param {string} name       Name of the uploaded file
     * @param {string} hash       Hash of the uploaded file
     * @param {any[]}  properties Array with additional properties of the uploaded file
     */
    if (this.uploadComplete==null){
        this.uploadComplete = function(name, hash, properties){
            return new Promise(function(resolve, reject){
                console.warn("Uploader: uploadComplete implementation missing")
                reject()
            })
        }
    }
    
    /**
     * @function getListOfFilesWithHash
     * @memberof UploadReceiver
     * @description Prototype.
     *                  Override with custom implementation to return list of files with a specific hash
     * @param {string} hash Hash to match
     */
    if (this.getListOfFilesWithHash==null){
        this.getListOfFilesWithHash = function(hash){
            console.warn("Uploader: getListOfFilesWithHash implementation missing")
            return []
        }
    }
}

module.exports.UploadReceiver = UploadReceiver