var Loadable = require('./core/loadable.js').Loadable

/**
 * @class Boxes
 * @version 1.2.0
 * @description Available VM boxes
 *              No need to instantiate, just reference the shared instance on widow.boxes
 *              
 * @param {string} widowAddress Address to back-end "Widow"
 */
function Boxes(widowSettings){
    //Inherit loading and item handling capabilities from loadable
    Loadable.call(this, widowSettings, "/vagrant/boxes/all")
}

/**
 * @function getBoxesList
 * @description Returns an array with strings of the box names
 * @memberof Boxes
 * @returns {string[]} Array with box names as strings
 */
Boxes.prototype.getBoxesList = function(){
    return this.getItemList()
}


Boxes.prototype.linkAndSyncPOST = function(vagrantBoxID, syncUpdateCallback){
    console.log("LinkAndSyncPOST....")
    
    return this.downloadBoxFromVagrant(vagrantBoxID, syncUpdateCallback)
    .then(function(response){
        
        this.requestTaskProgress(response.data.task_id, syncUpdateCallback)

    }.bind(this))

}

Boxes.prototype.downloadBoxFromVagrant = function(vagrantBoxID, progressUpdateCallBack){
    return new Promise(function(resolve, reject){
        var axios = require('axios').create({
            headers: {'Content-Type': 'application/json'}
        })
        // console.log("...")
        console.log("Downloading vagrant box: "+vagrantBoxID+"...")
        axios.post(this.getAddress()+"/vagrant/boxes/add", {"box_name":vagrantBoxID})
        .then(function (response) {
            console.log(response)
            console.log("Started download...")
            resolve(response)
        }.bind(this))
        .catch(function (error) {
            console.log("Download Box Failed...")
            console.log(error);
            reject(error)
        }.bind(this));

    }.bind(this))
}


Boxes.prototype.requestTaskProgress = function(taskID, syncUpdateCallback){
    var axios = require('axios')
    console.log("Getting progress for task: "+ taskID +"...")
    axios.get(this.getAddress() + "/vagrant/taskStatus/" + taskID)
    .then(function (response) {
        //if response says download is not 100%

        
        // this.requestTaskProgress(taskID, syncUpdateCallback)

        console.log("task update received")
        syncUpdateCallback(50)
        
    }.bind(this))
    .catch(function (error) {
        // handle error
        console.log("axios encountered a problem requesting task progress...")
        
    })
}

module.exports.Boxes = Boxes