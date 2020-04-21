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
    console.log("inside Boxes, calling load...")
    Loadable.call(this, widowSettings, "/vagrant/boxes/all")
    Modifiable.call(this)

    //dictionary to contain all the Box objects for those currently on server
    this.boxesList = {}
}


/**
 * @function getBoxesList
 * @description Returns an array with box objects
 * @memberof Boxes
 * @returns {string[]} Array with box objects
 */
Boxes.prototype.getBoxesList = function(){
    return this.boxesList
}

Boxes.prototype.downloadBoxFromVagrant = function(vagrantBoxID, syncUpdateCallback){
    return new Promise(function(resolve, reject){

        console.log("Downloading vagrant box: "+vagrantBoxID+"...")
        
        axiosBridged({
            url: this.getAddress()+"/vagrant/boxes/add",
            method: 'post',
            data: {"box_name":vagrantBoxID},
            headers: {'Content-Type': 'application/json'}
        }, function (response) {
            console.log(response)
            console.log("Starting download...")
            var placeHolderBox = new Box(vagrantBoxID)
            this.requestTaskProgress(response.data.task_id, syncUpdateCallback, modificationTypes.ADDED_ELEMENT, placeHolderBox)
            resolve(response)
        }.bind(this), function (error) {
            console.log("Download Box Failed...")
            console.log(error);
            reject(error)
        }.bind(this))

    }.bind(this))
}


Boxes.prototype.requestTaskProgress = function(taskID, syncUpdateCallback, modificationType, arg){
    console.log("Getting progress for task: "+ taskID +"...")
    
    axiosBridged({
        url: this.getAddress() + "/vagrant/taskStatus/" + taskID
    }, function (response) {
        //if response says download is not 100%
        if(syncUpdateCallback != null){
            syncUpdateCallback(((response.data.body.current*1.0)/response.data.body.total)*100)
        }
        console.log(response.data)
        if(response.data.body.state == "PROGRESS"){
            console.log("calling requestTaskProgress...")
            this.requestTaskProgress(taskID, syncUpdateCallback, modificationType, arg)
        }else{
            if(response.data.body.state == "SUCCESS"){
                console.log("Task complete...")
                //Update local list of boxes to reflect changes made on server
                if(modificationType != null && arg != null){
    
                    console.log("Updating boxesList...")
                    switch(modificationType){
                        case modificationTypes.ADDED_ELEMENT:
                            this.boxesList[arg.getName()] = arg
                            break;

                        case modificationTypes.REMOVED_ELEMENT:
                            if(this.boxesList.hasOwnProperty(arg.getName())){
                                delete this.boxesList[arg.getName()]
                            }
                            break;
                    }
                    console.log("Emitting modified event...")
                    emitModifiedEvent(this, null, modificationType, arg)
                }else{
                    console.log("modificationtype is null, can't emit...")
                }
            }else{
                console.log("Server has suddenly stopped replying with 'PROGRESS'")
            }
        }
        console.log("Task status update received...")
    }.bind(this), function (error) {
        console.log(error)
        console.log("An error occured while requesting task progress...")
        
    })
    
}


Boxes.prototype.removeBox = function(boxName, modificationType, arg) {
    
    axiosBridged({
        url: this.getAddress()+"/vagrant/boxes/remove",
        method: 'post',
        data: {"box_name":boxName},
        headers: {'Content-Type': 'application/json'}
    }, function (response) {
        console.log(response)
        this.requestTaskProgress(response.data.task_id, null, modificationType, arg)
    }.bind(this), function (error) {
        console.log(error);
        console.log("Box Deletion Failed...")
    }.bind(this))
    
}

function Box(boxName){
    this.name = boxName
    this.description = "No description provided"

    this.setDescription = function(text){
        this.description = text
    }
    
    this.getName = function(){
        return this.name
    }

    this.getDescription = function(){
        return this.description
    }
}

module.exports.Boxes = Boxes