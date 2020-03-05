const electron = require('electron')

const widowAddress = "http://localhost:5000/"

function Scenarios(widowAddress){
    this.widowAddress = widowAddress
    this.nameList = null
    this.loaded = {}
    
}

/*========================*/
/*=== Get scenarios
/*========================*/

Scenarios.prototype.getScenarioByName = function(name){
    return this.loaded[name]
}

// Get array of scenario objects in order
Scenarios.prototype.getAllScenarios = function(){
    var scenarioList = []
    
    this.nameList.forEach(function(name){
        scenarioList.push(this.getScenarioByName(name))
    }.bind(this))
    return scenarioList
}

/*========================*/
/*=== Add scenarios
/*========================*/

//...

/*========================*/
/*=== Remove scenarios
/*========================*/

//...

/*========================*/
/*=== Scenario saving
/*========================*/

// Save scenario name on widow
Scenarios.prototype.saveScenarioDeclaration = function(scenario){
    
}

// Call to trigger a save to Widow
Scenarios.prototype.saveScenario = function(scenario){
    
}

/*========================*/
/*=== Scenario loading
/*========================*/

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

/*======================================================*/
/*=== Automatic instance for shared Electron runtime ===*/
/*======================================================*/
try{
    // Try to get existing scenarios instance from electron.remote
    var widow = {}
    widow.scenarios = electron.remote.getGlobal('scenarios')
    widow.scenarios.loadScenarios().then(function(){widow.scenarios.loadAllScenarios()})
    
}catch{
    // Create a new instance and put on exports for main to pick up and put on electron.remote
    try{
        exports.scenarios = new Scenarios(widowAddress)
    }catch{
        console.log("Automatic instance of widow.scenarios failed to start")
    }
    
}


