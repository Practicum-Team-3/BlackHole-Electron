//========================
//=== Boxes
//========================

/**
 * @class Boxes
 * @version 1.0.1
 * @description Available VM boxes
 *              No need to instantiate, just reference the shared instance on widow.boxes
 *              
 * @param {string} widowAddress Address to back-end "Widow"
 */
function Boxes(widowSettings){
    var widowSettings = widowSettings
    
    this.getAddress = function(){
        return widowSettings.getAddress()
    }
    
    this.boxes = {}
}

/**
 * @function loadBoxes
 * @description Pulls available boxes from Widow
 * @see getBoxesList
 * @memberof Boxes
 * @returns {Promise} Promise for the completion of the loading
 */
Boxes.prototype.loadBoxes = function(){
    return new Promise(function(resolve, reject){
        
        var axios = require('axios')
        
        axios.get(this.getAddress()+"/boxes/all")
        .then(function (response) {
            // Keep list locally
            this.boxes = response.data
            resolve()
            
        }.bind(this)).catch(function (error) {
            // handle error
            //console.log(error);
            reject(error)
            
        })
    }.bind(this))
}

/**
 * @function getBoxesList
 * @description Returns an array with strings of the box names
 * @memberof Boxes
 * @returns {string[]} Array with box names as strings
 */
Boxes.prototype.getBoxesList = function(){
    var boxesList = []
    for (boxNum in this.boxes){
        boxesList.push(this.boxes[boxNum])
    }
    return boxesList
}


module.exports.Boxes = Boxes