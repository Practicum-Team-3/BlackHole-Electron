/**
 * @class Loadable
 * @version 1.2.0
 * @protected
 * @description Object that handles the loading and basic management of items contained in an object
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
    
    this.super = {}

    /**
     * @function load
     * @protected
     * @description Pulls available items from Widow
     * @memberof Loadable
     * @see getList
     * @returns {Promise} Promise for the completion of the loading
     */
    this.load = function(){
        console.log("loadable's load was called")
        return new Promise(function(resolve, reject){
            
            axiosBridged({
                url: this.getAddress()+this.getLoadPath()
            }, function (response) {
                // Keep list locally
                //TODO: Improve wrapper integration
                this.items = response.data.body
                resolve()

            }.bind(this), function (error) {
                // handle error
                console.log(error);
                reject(error)

            })
            
        }.bind(this))
    }
    
    

    /**
     * @function getList
     * @description Inherited on super.
     *                  Returns an array with the contents of each item's value
     * @protected
     * @memberof Loadable
     * @returns {Any[]} Array with loaded items
     */
    this.super.getItemList = function(){
        var itemList = []
        for (itemName in this.items){
            itemList.push(this.items[itemName])
        }
        return itemList
    }.bind(this)
    
    /**
     * @function getItemByName
     * @description Inherited on super.
     *                  Returns the item referenced in the list by a the name passed
     * @param   {string} itemName Name of the item to get
     * @returns {Any} The item
     */
    this.super.getItemByName = function(itemName){
        return this.items[itemName]
    }.bind(this)
    
    /**
     * @function removeItem
     * @description Inherited on super.
     *                  Removes a specific item from the list of items. 
     * @param {Any} item                  The instance of the item to remove
     * @param {boolean} onlyFirstInstance Optional: By default, the remove operation removes all instances of
     *                                    the item from the list. Pass true on onlyFirstInstance to only remove the first instance.
     */
    this.super.removeItem = function(item, onlyFirstInstance=false){
        for (itemName in this.items){
            
            if (this.items[itemName]==item){
                delete this.items[itemName]
                if (onlyFirstInstance){
                    break
                }
            }
        }
    }.bind(this)
    
}


module.exports.Loadable = Loadable