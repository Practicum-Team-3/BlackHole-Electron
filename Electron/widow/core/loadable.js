/**
 * @class Loadable
 * @version 1.0.1
 * @protected
 * @description Object that handles the loading and management of items
 *              
 * @param {string} widowSettings Instance of conection settings for black-widow
 * @param {string} loadPath URI to service
 */
function Loadable(widowSettings, loadPath){
    var widowSettings = widowSettings
    var loadPath = loadPath
    
    this.getAddress = function(){
        return widowSettings.getAddress()
    }
    
    this.getLoadPath = function(){
        return loadPath
    }
    
    this.items = {}


    /**
     * @function load
     * @protected
     * @description Pulls available items from Widow
     * @memberof Loadable
     * @see getList
     * @returns {Promise} Promise for the completion of the loading
     */
    this.load = function(){
        return new Promise(function(resolve, reject){

            var axios = require('axios')

            axios.get(this.getAddress()+this.getLoadPath())
            .then(function (response) {
                // Keep list locally
                //TODO: Improve wrapper integration
                this.items = response.data.body
                resolve()

            }.bind(this)).catch(function (error) {
                // handle error
                console.log(error);
                reject(error)

            })
        }.bind(this))
    }
    
    

    /**
     * @function getList
     * @description Returns an array with the contents of each item's value
     * @protected
     * @memberof Loadable
     * @returns {string[]} Array with box names as strings
     */
    this.getItemList = function(){
        var itemList = []
        for (itemNum in this.items){
            itemList.push(this.items[itemNum])
        }
        return itemList
    }
    
    this.getItemByName = function(itemName){
        return this.items[itemName]
    }
    
}


module.exports.Loadable = Loadable