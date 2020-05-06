/**
 * @class TaskObserver
 * @version 1.0.0
 * @description Observes a specific task running in Black Widow
 * @param   {WidowSettings} widowSettings
 * @param   {string}        taskCheckPath      Path to the task check service
 * @param   {string}        taskId             ID of the task to check
 * @param   {function}      prograssCallback   Callback to update progress. Gets passed int for percentage
 * @param   {function}      completionCallback Callback for when the task is done
 */
function TaskObserver(widowSettings, taskCheckPath, taskId, progressCallback, completionCallback){
    var widowSettings = widowSettings
    var taskCheckPath = taskCheckPath
    var taskId = taskId
    
    this.getTaskAddress = function(){
        return widowSettings.getAddress()+taskCheckPath+taskId
    }
    
    this.callProgress = function(percentage){
        if (progressCallback!=null){
            progressCallback(percentage)
        }
    }
    
    this.callCompletion = function(){
        if (completionCallback!=null){
            completionCallback()
        }
    }
    
    this.requestTaskProgress()
}

/**
 * @function requestTaskProgress
 * @memberof TaskObserver
 * @private
 * @description Sends request for task progress, calls again upon receiving
 */
TaskObserver.prototype.requestTaskProgress = function(){
    
    axiosBridged({
        url: this.getTaskAddress()
    }, function (response) {

        try{
            //if response says download is not 100%
            this.callProgress(Math.ceil(100*response.data.body.current/response.data.body.total))
            
            if (response.data.body.state == "PROGRESS"){
                
                // Setup to request progress again
                setTimeout(this.requestTaskProgress.bind(this), 700)
                
            }else if (response.data.body.state == "SUCCESS"){
                
                console.log("Task complete...")
                this.callCompletion()
                
            }else{
                console.log("Task state unknown "+response.data.body.state)
            }
        }catch(error){
            console.log(error)
        }

    }.bind(this), function (error) {
        console.log("An error occured while requesting task progress...")
        console.log(error)
    })
    
}

/**
 * @class TaskMaster
 * @version 1.0.0
 * @description Set of functions that can be inherited directly to help in the observing of tasks
 * @param {WidowSettings} widowSettings
 */
function TaskMaster(widowSettings){
    this.taskObservers = {}
    
    /**
     * @function observe
     * @memberof TaskMaster
     * @description Starts the observing of a task by instantiating a TaskObserver. Removes the observer when task is completed
     * @param   {string}        taskCheckPath      Path to the task check service
     * @param   {string}        taskId             ID of the task to check
     * @param   {function}      prograssCallback   Callback to update progress. Gets passed int for percentage
     * @param   {function}      completionCallback Callback for when the task is done
     */
    this.observe = function(taskCheckPath, taskId, progressCallback, completionCallback){
        if (taskId==undefined || progressCallback==undefined || completionCallback==undefined){
            return
        }
        
        var completionCallbackWrap = function(){
            completionCallback()
            this.removeObserver(taskId)
        }.bind(this)
        
        var taskObserver = new TaskObserver(widowSettings, taskCheckPath, taskId, progressCallback, completionCallbackWrap)
        
        this.taskObservers[taskId] = taskObserver
    }
    
    /**
     * @function removeObserver
     * @memberof TaskMaster
     * @param {string} taskId ID of the task's observer to remove
     */
    this.removeObserver = function(taskId){
        delete this.taskObservers[taskId]
    }
}

module.exports.TaskMaster = TaskMaster
module.exports.TaskObserver = TaskObserver