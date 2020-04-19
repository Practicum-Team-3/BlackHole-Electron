var Loadable = require('./core/loadable.js').Loadable
var Modifiable = require('./core/modifiable.js').Modifiable

/**
 * @class Boxes
 * @version 1.4.0
 * @description Available VM boxes
 *              No need to instantiate, just reference the shared instance on widow.boxes
 *              
 * @param {string} widowAddress Address to back-end "Widow"
 */
function Boxes(widowSettings){
    //Inherit loading and item handling capabilities from loadable
    Loadable.call(this, widowSettings, "/vagrant/boxes/all")
    Modifiable.call(this)
}

/**
 * @function getBoxesList
 * @description Returns an array with strings of the box names
 * @memberof Boxes
 * @returns {string[]} Array with box names as strings
 */
Boxes.prototype.getBoxesList = function(){
    var boxesList = this.getItemList()
    console.log("Boxes received from backend:")
    for(var i = 0; i<boxesList.length; i++){
        console.log(boxesList[i])
    }
    return boxesList
}


Boxes.prototype.linkAndSyncPOST = function(vagrantBoxID, syncUpdateCallback, refreshGUICallback){
    console.log("LinkAndSyncPOST....")
    
    return this.downloadBoxFromVagrant(vagrantBoxID)
    .then(function(response){
        
        this.requestTaskProgress(response.data.task_id, syncUpdateCallback, refreshGUICallback)

    }.bind(this))
    .catch(function(){
        console.log("an error occurred inside linkAndSyncPOST")
    })

}

Boxes.prototype.downloadBoxFromVagrant = function(vagrantBoxID){
    return new Promise(function(resolve, reject){

        console.log("Downloading vagrant box: "+vagrantBoxID+"...")
        
        axiosBridged({
            url: this.getAddress()+"/vagrant/boxes/add",
            method: 'post',
            data: {"box_name":vagrantBoxID},
            headers: {'Content-Type': 'application/json'}
        }, function (response) {
            console.log(response)
            console.log("Started download...")
            resolve(response)
        }.bind(this), function (error) {
            console.log("Download Box Failed...")
            console.log(error);
            reject(error)
        }.bind(this))

    }.bind(this))
}


Boxes.prototype.requestTaskProgress = function(taskID, syncUpdateCallback, refreshGUICallback){
    console.log("Getting progress for task: "+ taskID +"...")
    
    axiosBridged({
        url: this.getAddress() + "/vagrant/taskStatus/" + taskID
    }, function (response) {
        //if response says download is not 100%
        syncUpdateCallback(((response.data.body.current*1.0)/response.data.body.total)*100)
        console.log(response.data)
        if(response.data.body.current < response.data.body.total){
            this.requestTaskProgress(taskID, syncUpdateCallback, refreshGUICallback)
        }else{
            refreshGUICallback()
        }
        console.log("Task status update received...")
    }.bind(this), function (error) {
        console.log(error)
        console.log("An error occured while requesting task progress...")
        
    })
    
}


Boxes.prototype.removeBox = function(boxName) {
    return new Promise(function(resolve, reject){

        console.log("Removing vagrant box: "+boxName+"...")
        
        axiosBridged({
            url: this.getAddress()+"/vagrant/boxes/remove",
            method: 'post',
            data: {"box_name":boxName},
            headers: {'Content-Type': 'application/json'}
        }, function (response) {
            console.log(response)
            console.log("Box deleted from server...")
            resolve(response)
        }.bind(this), function (error) {
            console.log("Box Deletion Failed...")
            console.log(error);
            reject(error)
        }.bind(this))

    }.bind(this))
}

module.exports.Boxes = Boxes