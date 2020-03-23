/**
 * @class Modifiable
 * @version 1.0.0
 * @protected
 * @description Object with modification event handling
 */
function Modifiable(){
    var modificationCallbacks = new Set();
    
    //Event handling
    /**
     * @function onModified
     * @description Call to subscribe for when an edit occurs on the machine.
     *                  Be sure to call removeOnModifiedListener() when appropriate to avoid memory leaks
     * @memberof Machine
     * @param {function} callback Reference to a method to be called upon the emission of an edit event
     */
    this.onModified = function(callback){
        modificationCallbacks.add(callback)
    }
    
    /**
     * @function removeOnModifiedListener
     * @description Removes a listener for the the modified event
     * @param {function} callback Callback to remove
     */
    this.removeOnModifiedListener = function(callback){
        modificationCallbacks.delete(callback)
    }
    
    /**
     * @function emitModifiedEvent
     * @description After an edit to a machine instance, call this method to notify other listeners about the update
     * @memberof Machine
     * @param {function} ignoredCallback Callback to ignore when emitting the event. Usually this would be the updater's own callback
     */
    this.emitModifiedEvent = function(ignoredCallback){
        modificationCallbacks.forEach(function(callback){
            if (callback!=ignoredCallback){
                try{
                    callback(this)
                }catch{

                }
            }
        }.bind(this))
    }
}
                                      
module.exports.Modifiable = Modifiable