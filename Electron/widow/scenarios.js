const electron = require('electron')

const widowAddress = "http://localhost:5000/"

function Scenarios(widowAddress){
    this.widowAddress = widowAddress
    this.nameList = []
    this.loaded = {}
    
    this.scenarioLimbo = null
}

//========================
//=== Get scenarios
//========================

/**
 * getScenarioNameList()
 *
 * @return {string[]} Array of strings of the scenario names available
 */
Scenarios.prototype.getScenarioNamesList = function(){
    return this.nameList
}

/**
 * getScenarioByName()
 *
 * @param {string} name - Name of the scenario to obtain
 * @return {Scenario} Scenario object of the specified name
 */
Scenarios.prototype.getScenarioByName = function(name){
    return this.loaded[name]
}

// Get array of scenario objects in order
/**
 * getAllScenarios()
 * Obtain all Scenario objects in an array
 *
 * @return {Scenario[]} String of all Scenario objects
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
 * renameScenario()
 * Renames an existing scenario from the scenario list in widow
 *
 * @param {string} oldName - The old name of the scenario to update
 * @param {string} newName - New name to give the scenario
 */
Scenarios.prototype.addScenario = function(scenario){
    //STUB
}

//========================
//=== Add scenarios
//========================
   
/**
 * addScenario()
 * Adds a scenario instance to the list of scenarios in widow
 *
 * @param {Scenario} scenario - A Scenario instance to add to the list
 */
Scenarios.prototype.addScenario = function(scenario){
    if (!this.nameList.includes(scenario.getName())){
        this.nameList.push(scenario.getName())
    }
    this.loaded[scenario.getName()] = scenario
}

/**
 * createNewScenario()
 * Creates a new default Scenario object and returns it.
 * The new scenario is not automatically added to the list of scenarios in widow
 * If scenario is to be added to the list, call addNewScenario()
 *
 * @return {Scenario} Instance to a new Scenario object
 */
Scenarios.prototype.createNewScenario = function(){
    self.scenarioLimbo = new Scenario()
    return self.scenarioLimbo
}

/**
 * addNewScenario()
 * Adds the scenario created after a call to newScenario() to the list of scenarios in widow
 */
Scenarios.prototype.addNewScenario = function(){
    if (this.scenarioLimbo!=null){
        this.addScenario(this.scenarioLimbo)
        this.scenarioLimbo = null
    }
}

//========================
//=== Remove scenarios
//========================
/**
 * removeScenarioByName()
 * Remove a scenario from the list of scenarios in widow
 *
 * @param {string} scenarioName - Name of the scenario to remove
 * @return {Scenario} The instance of the removed scenario
 */
Scenarios.prototype.removeScenarioByName = function(scenarioName){
    if (this.nameList.includes(scenarioName)){
        //STUB
    }
}

//========================
//=== Scenario saving
//========================
/*
// Save scenario name on widow
Scenarios.prototype.saveScenarioDeclaration = function(scenario){
    
}
*/
// 
/**
 * saveScenarioByName()
 * Trigger the saving of a scenario to widow
 *
 * @param {string} scenarioName - Name of the scenario to save
 */
Scenarios.prototype.saveScenarioByName = function(scenarioName){
    //STUB
}

//========================
//=== Scenario loading (Internal)
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
            // Add to the loaded dictionary
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


