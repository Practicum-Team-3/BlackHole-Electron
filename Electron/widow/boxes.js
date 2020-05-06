const Loadable = require('./core/loadable.js').Loadable
const Modifiable = require('./core/modifiable.js').Modifiable
const TaskMaster = require('./core/task_observer.js').TaskMaster

/**
 * @class Boxes
 * @version 1.6.0
 * @description Modifiable. TaskMaster. Loadable.
 *              Available VM boxes
 *              No need to instantiate, just reference the shared instance on widow.boxes
 *              
 * @param {WidowSettings} widowSettings
 */
function Boxes(widowSettings){
    //Inherit loading and item handling capabilities from loadable
    console.log("inside Boxes, calling load...")
    Loadable.call(this, widowSettings, "/vagrant/boxes/all")
    Modifiable.call(this)
    TaskMaster.call(this, widowSettings)
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


Boxes.prototype.downloadBoxFromVagrant = function(vagrantBoxID, syncUpdateCallback, modificationType){
    
    console.log("Downloading vagrant box: "+vagrantBoxID+"...")
    
    axiosBridged({
        url: this.getAddress()+"/vagrant/boxes/add",
        method: 'post',
        data: {"box_name":vagrantBoxID},
        headers: {'Content-Type': 'application/json'}
    }, function (response) {
        console.log("Starting download...")
        
        var completionCallback = function(){
            
            this.items[vagrantBoxID] = vagrantBoxID
            console.log("addedElement")
            console.log("Emitting modified event...")
            this.emitModifiedEvent(null, "addedElement", vagrantBoxID)
            
        }.bind(this)
        this.observe("/vagrant/taskStatus/", response.data.task_id, syncUpdateCallback, completionCallback)
        
    }.bind(this), function (error) {
        console.log(error);
        console.log("Download Box Failed...")
    }.bind(this))

}


Boxes.prototype.removeBox = function(boxName) {
    console.log("Removing box "+boxName)
    
    axiosBridged({
        url: this.getAddress()+"/vagrant/boxes/remove",
        method: 'post',
        data: {"box_name":boxName},
        headers: {'Content-Type': 'application/json'}
    }, function (response) {

        try{
            
            var completionCallback = function(){

                this.super.removeItem(boxName)
                console.log("removedElement")
                this.emitModifiedEvent(null, "removedElement", boxName)
                
            }.bind(this)
            
            this.observe("/vagrant/taskStatus/", response.data.task_id, null, completionCallback)
        }catch(error){
            console.log(error)
        }
        
    }.bind(this), function (error) {
        console.log(error);
        console.log("Box Deletion Failed...")
    }.bind(this))
    
}

module.exports.Boxes = Boxes