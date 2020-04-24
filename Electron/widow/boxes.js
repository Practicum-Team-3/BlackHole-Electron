var Loadable = require('./core/loadable.js').Loadable
var Modifiable = require('./core/modifiable.js').Modifiable

/**
 * @class Boxes
 * @version 1.5.0
 * @description Available VM boxes
 *              No need to instantiate, just reference the shared instance on widow.boxes
 *              
 * @param {WidowSettings} widowSettings
 */
function Boxes(widowSettings){
    //Inherit loading and item handling capabilities from loadable
    console.log("inside Boxes, calling load...")
    Loadable.call(this, widowSettings, "/vagrant/boxes/all")
    Modifiable.call(this)

}


/**
 * @function getBoxesList
 * @description Returns an array with box objects
 * @memberof Boxes
 * @returns {string[]} Array with box objects
 */
Boxes.prototype.getBoxesList = function(){
    return this.super.getItemList()
}


/////////////////////////////////////
// Audit: 
//        > Split task observer into a separate class
//             > Hide task observer from public
//        > Add documentation comments

Boxes.prototype.requestTaskProgress = function(taskID, syncUpdateCallback, modificationType, arg){
    console.log("Getting progress for task: "+ taskID +"...")
    
    axiosBridged({
        url: this.getAddress() + "/vagrant/taskStatus/" + taskID
    }, function (response) {

        try{

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
                            case "addedElement":
                                this.items[arg] = arg
                                console.log("addedElement")
                                break;

                            case "removedElement":
                                this.super.removeItem(arg)
                                console.log("removedElement")
                                break;

                            default:
                                console.log("Modification type not recognized")
                                break;
                        }
                        console.log("Emitting modified event...")
                        this.emitModifiedEvent(null, modificationType, arg)
                    }else{
                        console.log("modificationtype is null, can't emit...")
                    }
                }else{
                    console.log("Server has suddenly stopped replying with 'PROGRESS'")
                }
            }

        }catch(error){
            console.log(error)
        }

    }.bind(this), function (error) {
        console.log(error)
        console.log("An error occured while requesting task progress...")
        
    })
    
}


Boxes.prototype.downloadBoxFromVagrant = function(vagrantBoxID, syncUpdateCallback, modificationType){
    
    console.log("Downloading vagrant box: "+vagrantBoxID+"...")
    
    axiosBridged({
        url: this.getAddress()+"/vagrant/boxes/add",
        method: 'post',
        data: {"box_name":vagrantBoxID},
        headers: {'Content-Type': 'application/json'}
    }, function (response) {
        console.log("Starting download...")
        try{
            this.requestTaskProgress(response.data.task_id, syncUpdateCallback, modificationType, vagrantBoxID)
        }catch(error){
            console.log(error)
        }
        
    }.bind(this), function (error) {
        console.log(error);
        console.log("Download Box Failed...")
    }.bind(this))

}


Boxes.prototype.removeBox = function(boxName) {

    
    axiosBridged({
        url: this.getAddress()+"/vagrant/boxes/remove",
        method: 'post',
        data: {"box_name":boxName},
        headers: {'Content-Type': 'application/json'}
    }, function (response) {

        try{
            this.requestTaskProgress(response.data.task_id, null, "removedElement", boxName)
        }catch(error){
            console.log(error)
        }
        
    }.bind(this), function (error) {
        console.log(error);
        console.log("Box Deletion Failed...")
    }.bind(this))
    
}

module.exports.Boxes = Boxes