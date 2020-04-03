var Modifiable = require('./core/modifiable.js').Modifiable
/**
 * @class Scenarios
 * @version 2.2.1
 * @description Modifiable. Manager of scenarios.
 *              No need to instantiate, just reference the shared instance on widow.scenarios
 *              
 * @param {WidowSettings} widowSettings Connection details to Widow backend
 */
function Scenarios(widowSettings){
    console.log("initializing Scenarios object...")
    Modifiable.call(this)
    var widowSettings = widowSettings
    
    this.getAddress = function(){
        return widowSettings.getAddress()
    }
    
    //Name list should only contain scenarios known by Widow
    this.nameList = []
    //Keep Scenario objects, known and not known by Widow
    this.loaded = {}
    //To keep a new scenario while it's being added
    this.scenarioLimbo = null
    
    //Flag to indicate if the initial loading has been done
    this.hasDoneInitialLoad = false
    console.log("Scenarios object initialized!")
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
                
            }.bind(this)).catch(function(){
                reject()
                
            }.bind(this))
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
 * The scenario can be obtained by calling getScenarioBeingCreated()
 * @see getScenarioBeingCreated()
 *      completeScenarioCreation()
 * @memberof Scenarios
 *
 * @return {Scenario} Instance to a new Scenario object
 */
Scenarios.prototype.createNewScenario = function(){
    var Scenario = require('./scenario.js').Scenario
    this.scenarioLimbo = new Scenario()
    return this.scenarioLimbo
}

/**
 * @function getScenarioBeingCreated
 * @description Returns the scenario created by a previous call to createNewScenario()
 * @memberof Scenarios
 * @returns {Scenario} The scenario being created
 */
Scenarios.prototype.getScenarioBeingCreated = function(){
    return this.scenarioLimbo
}

/**
 * @function completeScenarioCreation
 * @description Adds the scenario created after a call to createNewScenario() to the list of scenarios in widow
 *              and saves the scenario back to the widow backend
 * @memberof Scenarios
 * @returns {Promise} Promise for the completion of the scenario creation process
 */
Scenarios.prototype.completeScenarioCreation = function(){
    return new Promise(function(resolve, reject){
        if (this.scenarioLimbo!=null){
            this.addScenario(this.scenarioLimbo)
            .then(function(){
                var scenarioName = this.scenarioLimbo.getName()
                this.scenarioLimbo = null
                return this.saveScenarioByName(scenarioName)
            }.bind(this)).then(function(){
                resolve()
            }).catch(function(){
                reject()
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
 * @param {string} scenarioName - Name of the scenario to remove
 * @return {Scenario} The instance of the removed scenario
 */
Scenarios.prototype.removeScenarioByName = function(scenarioName){
    //Guard
    if (!this.nameList.includes(scenarioName)){
        return
    }
    
    return new Promise(function(resolve, reject){

        var axios = require('axios')

        axios.get(this.getAddress()+"/scenarios/delete/"+scenarioName)
        .then(function (response) {
            // Can delete locally
            this.nameList.pop(scenarioName)
            delete this.loaded[scenarioName]
            resolve()

        }.bind(this)).catch(function (error) {
            // handle error
            console.log(error);
            reject()

        })
    }.bind(this))
    
}

//========================
//=== Scenario loading/saving (Internal)
//========================

// === Contact Widow and get the list of scenarios === //
Scenarios.prototype.loadScenarios = function(){
    return new Promise(function(resolve, reject){
        var axios = require('axios')
        console.log("loading axios...")
        axios.get(this.getAddress() + "/scenarios/all")
        .then(function (response) {
            // Keep list locally
            //TODO: Improve wrapper integration
            console.log("axios loaded succesfully")
            console.log("scenarios: " + response.data.body.scenarios)

            this.nameList = response.data.body.scenarios
            resolve()
        }.bind(this)).catch(function (error) {
            
            // handle error
            console.log("axios encountered a problem")
            console.log(error);
            reject()
            
        })
    }.bind(this))
    
}

// === Load a specific scenario into memory === //
Scenarios.prototype.loadScenarioByName = function(scenarioName){
    return new Promise(function(resolve, reject){
        var Scenario = require('./scenario.js').Scenario
        var axios = require('axios')
        
        axios.get(this.getAddress()+"/scenarios/"+encodeURIComponent(scenarioName))
        .then(function (response) {
            // Add to the loaded object
            //TODO: Improve wrapper integration
            this.loaded[scenarioName] = new Scenario(response.data.body)
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
            console.log(this.getAddress()+"/scenarios/newEmpty/"+encodeURIComponent(scenarioName))
            axios.get(this.getAddress()+"/scenarios/newEmpty/"+encodeURIComponent(scenarioName))
            .then(function (response) {
                // Add to the loaded dictionary
                resolve()

            }.bind(this)).catch(function (error) {
                // handle error
                console.log("declareScenarioByName Error")
                console.log(error);
                reject()

            }.bind(this))
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
            
            axios.post(this.getAddress()+"/scenarios/edit", this.getScenarioByName(scenarioName).getDescriptorAsString())
            .then(function (response) {
                resolve()
            })
            .catch(function (error) {
                console.log("F3")
                console.log(error);
                reject()
            });
        }else{
            console.log("Scenario saving rejected")
            reject()
        }
    }.bind(this))
}

//========================
//=== Vagrant
//========================

/**
 * @function prepareMachinesByScenarioName
 * @description Tells Widow backend to have the VMs ready for running
 * @memberof Scenarios
 * @param   {string} scenarioName Name of the scenario to prepare the machines for
 * @returns {Promise} Promise for the preparation of the machines
 */
Scenarios.prototype.prepareMachinesByScenarioName = function(scenarioName){
    return new Promise(function(resolve, reject){
        // Check for the existance of the "new scenario", should fail if already exists
        if (this.nameList.includes(scenarioName)){
            var axios = require('axios')
            
            axios.get(this.getAddress()+"/vagrantFiles/"+encodeURIComponent(scenarioName)+"/all")
            .then(function (response) {
                resolve()

            }.bind(this)).catch(function (error) {
                // handle error
                console.log("createVagrant Error")
                console.log(error);
                reject()

            }.bind(this))
        }else{
            console.log("No scenario")
            reject()
        }
    }.bind(this))
}

/**
 * @function runScenarioByName
 * @description Execute the run command on a specific scenario
 * @memberof Scenarios
 * @param   {string} scenarioName Name of the scenario to run
 * @returns {Promise} Promise for the completion of the run command
 */
Scenarios.prototype.runScenarioByName = function(scenarioName){
    return new Promise(function(resolve, reject){
        // Check for the existance of the "new scenario", should fail if already exists
        if (this.nameList.includes(scenarioName)){
            var axios = require('axios')
            
            axios.get(this.getAddress()+"/vagrant/"+encodeURIComponent(scenarioName)+"/run")
            .then(function (response) {
                // Add to the loaded dictionary
                resolve()

            }.bind(this)).catch(function (error) {
                // handle error
                console.log("run Error")
                console.log(error);
                reject()

            }.bind(this))
        }else{
            reject()
        }
    }.bind(this))
}


module.exports.Scenarios = Scenarios