const electron = require('electron')
const widowAddress = "http://localhost:5000/"

/**
 * @class Scenarios
 * @version 1.0.0
 * @description Manager of scenarios and connection to Widow.
 *              No need to instantiate, just reference the shared instance on widow.scenarios
 *              
 * @param {string} widowAddress Address to back-end "Widow"
 */
function Scenarios(widowAddress){
    this.widowAddress = widowAddress
    //Name list should only contain scenarios known by Widow
    this.nameList = []
    //Keep Scenario objects, known and not known by Widow
    this.loaded = {}
    //To keep a new scenario while it's being added
    this.scenarioLimbo = null
}

//========================
//=== Get scenarios
//========================

/**
 * @function getScenarioNameList
 * @description Get the list of scenarios currently saved on Widow
 * @memberof Scenarios
 *
 * @return {string[]} Array of strings of the scenario names available
 */
Scenarios.prototype.getScenarioNamesList = function(){
    return this.nameList
}

/**
 * @function getScenarioByName
 * @description Get the instance of a specific scenario with a specific name
 * @memberof Scenarios
 *
 * @param {string} name - Name of the scenario to obtain
 * @return {Scenario} Scenario object of the specified name
 */
Scenarios.prototype.getScenarioByName = function(name){
    return this.loaded[name]
}

/**
 * @function getAllScenarios
 * @description Obtain all Scenario objects as an array
 * @memberof Scenarios
 *
 * @return {Scenario[]} Array of all Scenario objects
 */
Scenarios.prototype.getAllScenarios = function(){
    var scenarioList = []
    
    this.nameList.forEach(function(name){
        scenarioList.push(this.getScenarioByName(name))
    }.bind(this))
    return scenarioList
}

//========================
//=== Rename scenarios
//========================

/**
 * @function renameScenario
 * @description Renames an existing scenario from the scenario list in widow
 * @memberof Scenarios
 * @todo Implement when Widow supports scenario renaming
 *
 * @param {string} oldName - The old name of the scenario to update
 * @param {string} newName - New name to give the scenario
 * @returns {Promise} Promise for the completion of the renaming
 */
Scenarios.prototype.renameScenario = function(oldName, newName){
    return new Promise(function(resolve, reject){
        if (this.nameList.includes(oldName)){
            this.getScenarioByName("oldName").setName(newName)
            this.nameList[this.nameList.indexOf(oldName)] = newName
            // TODO: notify Widow about the renaming when supported
            // TODO: resolve promise
        }else{
            reject()
        }
    }.bind(this))
}

//========================
//=== Add scenarios
//========================
   
/**
 * @function addScenario
 * @description Adds a scenario instance to the list of scenarios in Widow
 * @memberof Scenarios
 *
 * @param {Scenario} scenario - A Scenario instance to add to the list
 * @returns {Promise} Promise for the completion of adding the scenario to Widow
 */
Scenarios.prototype.addScenario = function(scenario){
    return new Promise(function(resolve, reject){
        if (!this.nameList.includes(scenario.getName())){
            // declare new scenario to Widow
            this.declareScenarioByName(scenario.getName())
            .then(function(){
                this.nameList.push(scenario.getName())
                resolve()
            })
            // TODO: Add catch
        }
        //Scenario was already included, so just add (or overwrite) to loaded
        this.loaded[scenario.getName()] = scenario
    }.bind(this))
    
}

/**
 * @function createNewScenario
 * @description Creates a new default Scenario object and returns it.
 * The new scenario is not automatically added to the list of scenarios in widow.
 * To complete the creation process and add the scenario to the list, call completeScenarioCreation()
 * @memberof Scenarios
 *
 * @return {Scenario} Instance to a new Scenario object
 */
Scenarios.prototype.createNewScenario = function(){
    self.scenarioLimbo = new Scenario()
    return self.scenarioLimbo
}

/**
 * @function addNewScenario
 * @description Adds the scenario created after a call to createNewScenario() to the list of scenarios in widow
 * @memberof Scenarios
 * @returns {Promise} Promise for the completion of the scenario creation process
 */
Scenarios.prototype.completeScenarioCreation = function(){
    return new Promise(function(resolve, reject){
        if (this.scenarioLimbo!=null){
            this.addScenario(this.scenarioLimbo)
            .then(function(){
                this.scenarioLimbo = null
                resolve()
            })
        }else{
            reject()
        }
    }.bind(this))
    
}

//========================
//=== Remove scenarios
//========================
/**
 * @function removeScenarioByName
 * @description Remove a scenario from the list of scenarios in widow
 * @memberof Scenarios
 * @todo Implement back-end deletion when Widow supports it
 *
 * @param {string} scenarioName - Name of the scenario to remove
 * @return {Scenario} The instance of the removed scenario
 */
Scenarios.prototype.removeScenarioByName = function(scenarioName){
    if (this.nameList.includes(scenarioName)){
        this.nameList.pop(scenarioName)
        delete this.loaded[scenarioName]
        //TODO implement remote deletion
    }
}

//========================
//=== Scenario loading/saving (Internal)
//========================

// === Contact Widow and get the list of scenarios === //
Scenarios.prototype.loadScenarios = function(){
    return new Promise(function(resolve, reject){
        
        var axios = require('axios')
        
        axios.get(this.widowAddress+"scenarios/all")
        .then(function (response) {
            // Keep list locally
            this.nameList = response.data.scenarios
            resolve()
            
        }.bind(this)).catch(function (error) {
            // handle error
            console.log(error);
            reject()
            
        })
    }.bind(this))
}

// === Load a specific scenario into memory === //
Scenarios.prototype.loadScenarioByName = function(name){
    return new Promise(function(resolve, reject){
        var Scenario = require('./scenario.js').Scenario
        var axios = require('axios')
        
        axios.get(this.widowAddress+"scenarios/"+name)
        .then(function (response) {
            // Add to the loaded object
            this.loaded[name] = new Scenario(response.data)
            resolve()
            
        }.bind(this)).catch(function (error) {
            // handle error
            console.log(error);
            reject()
            
        })
    }.bind(this))
}

// === Load all available scenarios into memory === //
Scenarios.prototype.loadAllScenarios = function(){
    return new Promise(function(resolve, reject){
        
        this.nameList.forEach(async function(name, index){
            await this.loadScenarioByName(name)
            
        }.bind(this))
        resolve()
        
    }.bind(this))
}

/**
 * @function declareScenarioByName
 * @private
 * @description Declare a new scenario name to Widow
 * @memberof Scenarios
 * @param   {string} scenarioName Name of the scenario to declare
 * @returns {Promise} Promise for the completion of the declaration
 */
Scenarios.prototype.declareScenarioByName = function(scenarioName){
    return new Promise(function(resolve, reject){
        // Check for the existance of the "new scenario", should fail if already exists
        if (!this.nameList.includes(scenarioName)){
            var axios = require('axios')

            axios.get(this.widowAddress+"scenarios/new/"+name)
            .then(function (response) {
                // Add to the loaded dictionary
                resolve()

            }.bind(this)).catch(function (error) {
                // handle error
                console.log("declareScenarioByName Error")
                console.log(error);
                reject()

            })
        }else{
            reject()
        }
    }.bind(this))
}

/**
 * @function saveScenarioByName
 * @description Trigger the saving of a scenario to Widow
 * @memberof Scenarios
 * @param   {string} scenarioName Name of the scenario to save
 * @returns {Promise} Promise for the completion of the saving
 */
Scenarios.prototype.saveScenarioByName = function(scenarioName){
    return new Promise(function(resolve, reject){
        var axios = require('axios')

        //Check if the scenario exists and can be saved
        if (this.nameList.includes(scenarioName)){
            
            axios.post(this.widowAddress+"scenarios/edit/"+scenarioName, this.getScenarioByName("scenarioName").getDescriptorAsString())
            .then(function (response) {
                console.log(response);
                resolve()
            })
            .catch(function (error) {
                console.log(error);
                reject()
            });
        }else{
            reject()
        }
    }.bind(this))
}

//======================================================
//=== Automatic instance for shared Electron runtime ===
//======================================================
try{
    // Try to get existing scenarios instance from electron.remote
    let scenarios = electron.remote.getGlobal('scenarios')
    
    if (scenarios.nameList.length==0){
        var widow = {}
        widow.scenarios = scenarios
        widow.scenarios.loadScenarios().then(function(){widow.scenarios.loadAllScenarios()})
    }
}catch{
    // Create a new instance and put on exports for main to pick up and put on electron.remote
    try{
        exports.scenarios = new Scenarios(widowAddress)
    }catch{
        console.log("Automatic instance of widow.scenarios failed to start")
    }
}


