var tabBarNode = null
var scenarioViewsNode = null
var idList = new Set()
// To store references to central views indexed by scenario name
var scenarioTabAndViews = []

try{
    window.$ = window.jQuery = require("../../../Electron/node_modules/jquery/dist/jquery")
}catch{}

//Called when loaded. Opens a tab for the scenario from the url parameter
window.onload = function(){
    // Toast setup
    $('.toast').toast({delay: 2000});
    
    //Save references to nodes of tab bar and scenario views
    tabBarNode = document.getElementById("tabBar")
    scenarioViewsNode = document.getElementById("scenarioViewsContainer")
    //TODO: open tabs for previously opened scenarios
    
    //Open tab for selected scenario
    try{
        openScenario(getCurrentScenario())
    }catch(error){
        console.log(error)
    }
}

/**
 * @function getCurrentScenario
 * @description Pull current scenario from widow based on the scenario name url parameter
 * @return {Scenario} Scenario object of current scenario
 * @throws No scenario found
 */
function getCurrentScenario(){
    var selectedScenario = null
    
    //Get name of scenario
    var selectedScenarioName = getUrlVars()["scenario"]
    
    //Pull from widow
    if (selectedScenarioName==null){//New scenario
        selectedScenarioName = ""
        selectedScenario = widow.scenarios.getScenarioBeingCreated()
    }else{
        selectedScenarioName = selectedScenarioName
        selectedScenario = widow.scenarios.getScenarioByName(selectedScenarioName)
    }
    
    if (selectedScenario==null){
        throw("No scenario found")
    }
    
    return selectedScenario
}

/**
 * @function openScenario
 * @description Makes the required ui elements
 * @param {Scenario} scenario Instance of Scenario to create a tab and view for
 */
function openScenario(scenario){
    if (scenario==null){
        //TODO: Throw
        return
    }
    
    //Make the tabbed section for the scenario
    var scenarioTabAndView = new ScenarioTabAndView(scenario, tabBar, scenarioViewsNode)
    scenarioTabAndViews.push(scenarioTabAndView)
}

function showToast(title, message){
    $('.toast').toast('show');
    document.getElementById("toastHeader").innerHTML = title
    document.getElementById("toastBody").innerHTML = message
}

// TODO: move this somewhere else
/*
function runScenario(){
    console.log("Running...")
    widow.scenarios.createVagrant(selectedScenarioName).then(function(){
        console.log("Vagrant created")
        return widow.scenarios.run(selectedScenarioName)
    }).then(function(){
        console.log("Running")
    })
}
*/

