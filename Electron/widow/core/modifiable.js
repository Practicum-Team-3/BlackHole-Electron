const electron = require('electron')
//const util = process.electronBinding('v8_util')
/**
 * @class Modifiable
 * @version 2.0.1
 * @description Object with modification event handling
 */
function Modifiable(){
    // Object indexed by the id fo the web contents. Containing set of callbacks
    var modificationCallbacks = {};
    
    function addModificationCallback(callback, webContentsId){
        if (modificationCallbacks[webContentsId]==null){
            modificationCallbacks[webContentsId] = new Set()
        }
        
        modificationCallbacks[webContentsId].add(callback)
    }
    
    this.getCallbacks = function(){
        return modificationCallbacks
    }
    
    //Event handling
    /**
     * @function onModified
     * @description Call to subscribe for when an edit occurs.
     *                  Be sure to call removeOnModifiedListener(), when appropriate, to avoid memory leaks
     * @memberof Modifiable
     * @param {function} callback Reference to a method to be called upon the emission of an edit event
     * @param {number} webContentsId Id of webContents that the callback belongs to
     */
    this.onModified = function(callback, webContentsId){
        if (callback==null){
            throw "Invalid onModified settings"
        }
        
        // Make sure the added callback will get removed when containing window is outtahere
        // First, get the "window" and check if already subscribed to it (have added listeners from it before)
        var webContents = electron.webContents.fromId(webContentsId)
        if (this.getCallbacks()[webContentsId]==null && webContents!=null){

            // Subscribe to event so all of the callbacks issued from this window are removed when it gets unloaded
            webContents.once('render-view-deleted', function(event){
                console.log("Attempting to remove onmodified listeners for: "+event.sender.id)
                
                // Iterate through all local callbacks added by this window that issued the event
                this.getCallbacks()[event.sender.id].forEach(function(callback){
                    
                    // And remove
                    this.removeOnModifiedListener(callback, event.sender.id)
                    
                }.bind(this))
                
                //Remove whole 
                delete this.getCallbacks()[event.sender.id]
                
            }.bind(this))
        }
        
        
        // Add callback
        addModificationCallback(callback, webContentsId)
    }
    
    /**
     * @function removeOnModifiedListener
     * @description Removes a listener for the the modified event
     * @memberof Modifiable
     * @param {function} callback Callback to remove
     * @param {number} webContentsId Id of webContents that the callback belongs to
     */
    this.removeOnModifiedListener = function(callback, webContentsId){
        var callbacks = this.getCallbacks()
        
        callbacks[webContentsId].delete(callback)
    }
    
    /**
     * @function emitModifiedEvent
     * @description After an edit, call this method to notify other listeners about the update
     * @memberof Modifiable
     * @param {function} ignoredCallback Callback to ignore when emitting the event. Usually this would be the updater's own callback
     * @param {string} eventType Name of the event
     * @param {Any} eventArg Argument tied to the event
     */
    this.emitModifiedEvent = function(ignoredCallback, eventType, eventArg){
        var callbacks = this.getCallbacks()
        for (webContentsId in callbacks){
            
            callbacks[webContentsId].forEach(function(callback){
                if (callback!=ignoredCallback){
                    try{
                        callback(this, eventType, eventArg)
                    }catch{

                    }
                }
            }.bind(this))
        }
    }
}
                                      
module.exports.Modifiable = Modifiable