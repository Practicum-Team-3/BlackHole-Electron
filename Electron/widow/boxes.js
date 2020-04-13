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

    //Dictionary to keep track of ongoing tasks
    this.tasksProgress = {}
    this.pollers = {}
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


Boxes.prototype.downloadBoxFromVagrant = function(vagrantID){
    return new Promise(function(resolve, reject){
        var axios = require('axios').create({
            headers: {'Content-Type': 'application/json'}
        })
        console.log("...")
        console.log("Downloading vagrant box: "+vagrantID+"...")
        axios.post(this.getAddress()+"/vagrant/boxes/add", {"box_name":vagrantID})
        .then(function (response) {
            console.log(response)
            console.log("Done")

            widow.boxes.startDownloadWatcher(response.data.task_id)

            resolve(response)
        })
        .catch(function (error) {
            console.log("Download Box Failed...")
            console.log(error);
            reject(error)
        });

    }.bind(this))
}


Boxes.prototype.startDownloadWatcher = function(taskID){
    this.pollers[taskID] = {"handler":setInterval(this.requestTaskProgress.bind(this, taskID), 2000), "attempts":0, "maxAttempts":1000}
    this.tasksProgress[taskID] = undefined
}


Boxes.prototype.stopDownload = function(taskID){
    if(this.pollers[taskID] != undefined){
        clearInterval(this.pollers[taskID].handler)
    }
}


Boxes.prototype.requestTaskProgress = function(taskID){

    if(this.tasksProgress[taskID] != undefined){
        if((this.tasksProgress[taskID].current >= this.tasksProgress[taskID].total)||(this.pollers[taskID].attempts > this.pollers[taskID].maxAttempts)){
            clearInterval(this.pollers[taskID].handler)

            //tell the overview to update itself
            emitModifiedEvent(widow.boxes, null, modificationTypes.ADDED_ELEMENT, null)
            return
        }
    }

    var axios = require('axios')

    axios.get(this.getAddress()+"/vagrant/taskStatus/" + taskID)
    .then(function(response){
        if(response != undefined){
            widow.boxes.tasksProgress[response.data.task_id] = response.data.body
            console.log("Task: " + response.data.task_id + ", Progress: " + (response.data.body.current*1.0 / response.data.body.total) + "%")
        }
    })
    .catch(function (error) {
        console.log(error);
        // reject(error)
    }.bind(taskID));

    this.pollers[taskID].attempts += 1
}

Boxes.prototype.getDownloadTaskProgress = function(taskID){
    return (((this.tasksProgress[taskID].current*1.0) / this.tasksProgress[taskID].total)*100)
}

module.exports.Boxes = Boxes