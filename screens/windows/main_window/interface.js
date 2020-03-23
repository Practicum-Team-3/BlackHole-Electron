var tabBarNode = null
var scenarioViewsNode = null
var idList = new Set()
// To store references to central views indexed by scenario name
var scenarioTabAndViews = {}


try{
    window.$ = window.jQuery = require("../../../Electron/node_modules/jquery/dist/jquery")
}catch{}

//=========
// Called when loaded. Opens a tab for the scenario from the url parameter
//=========
window.onload = function(){
    // Toast setup
    $('.toast').toast({delay: 2500});
    
    
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
 * @description Pull current scenario from widow, based on the scenario name url parameter
 * @return {Scenario} Scenario object of current scenario
 * @throws No scenario found
 */
function getCurrentScenario(){
    var selectedScenario = null
    
    //Get name of scenario
    var selectedScenarioName = getUrlVars()["scenarioName"]
    
    //Pull from widow
    if (selectedScenarioName!=null){
        
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
 * @description Opens a scenario on a new tab
 * @param {Scenario} scenario Instance of Scenario to create a tab and view for
 */
function openScenario(scenario){
    if (scenario==null){
        //TODO: Throw
        return
    }
    
    //Make the tabbed section for the scenario and keep reference
    var scenarioTabAndView = new ScenarioTabAndView(scenario, tabBar, scenarioViewsNode)
    scenarioTabAndViews[scenario.getName()] = scenarioTabAndView
}

/**
 * @function showToast
 * @description Shows a brief message to the user
 * @param {string} title   Title of the message
 * @param {string} message Content of the message
 */
function showToast(title, message){
    $('.toast').toast('show');
    document.getElementById("toastHeader").innerHTML = title
    document.getElementById("toastBody").innerHTML = message
}


/**
 * @function runScenario
 * @description Calls prepares machines and runs the scenario on widow
 */
function runScenario(){
    if (activeTabAndView==null){
        return
    }
    console.log("Running...")
    widow.scenarios.prepareMachinesByScenarioName(activeTabAndView.getScenario().getName()).then(function(){
        console.log("Vagrant created")
        return widow.scenarios.runScenarioByName(activeTabAndView.getScenario().getName())
    }).then(function(){
        console.log("Running")
    })
}

/**
 * @function saveScenario
 * @description Saves the scenario of the current tab
 */
function saveScenario(){
    if (activeTabAndView==null){
        return
    }
    console.log("Saving...")
    widow.scenarios.saveScenarioByName(activeTabAndView.getScenario().getName()).then(function(){
        console.log("Saved")
    })
}

