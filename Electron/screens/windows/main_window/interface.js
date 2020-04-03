var tabBarNode = null
var scenarioViewsNode = null
var idList = new Set()
var overviewsPanel = null
// To store references to central views indexed by scenario name
var scenarioTabAndViews = {}

try{
    window.$ = window.jQuery = require("../../../node_modules/jquery/dist/jquery")
}catch{
    console.log("failed to load jquery")
}

//=========
// Called when loaded. Opens a tab for the scenario from the url parameter
//=========
window.onload = function(){

    // Toast setup
    $('.toast').toast({delay: 2500});
    
    //Save references to nodes of tab bar and scenario views
    tabBarNode = document.getElementById("tabBar")
    scenarioViewsNode = document.getElementById("scenarioViewsContainer")
    overviewsPanelNode = document.getElementById("overviewsPanel")
    //TODO: open tabs for previously opened scenarios
    
    //Open tab for selected scenario
    try{
        openScenario(getCurrentScenario())
    }catch(error){
        console.log(error)
    }

    overviewsPanel = new OverviewsPanel(overviewsPanelNode)

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

//======================
// Open Scenarios
//======================

function openScenarioByName(scenarioName){
    var scenario = widow.scenarios.getScenarioByName(scenarioName)
    if (scenario==null){
        throw "Invalid scenario"
    }
    
    openScenario(scenario)
}

/**
 * @function openScenario
 * @description Opens a scenario on a new tab
 * @param {Scenario} scenario Instance of Scenario to create a tab and view for
 */
function openScenario(scenario){
    //Guard
    if (scenario==null){
        //TODO: Throw
        return
    }
    
    // If scenario already open, just switch to that tab
    if (scenarioTabAndViews[scenario.getName()]!=null){
        selectScenarioTab(scenario)
        
    }else{//If scenario not open, go ahead
        
        //Make the tabbed section for the scenario and keep reference
        var scenarioTabAndView = new ScenarioTabAndView(scenario, tabBar, scenarioViewsNode)
        scenarioTabAndViews[scenario.getName()] = scenarioTabAndView
        scenarioTabAndView.onClose(function(scenarioTabAndView){
            delete scenarioTabAndViews[scenarioTabAndView.getScenario().getName()]
            
            if (getActiveScenarioTab()==scenarioTabAndView){// We are closing the one that was selected
                // Select another tab, will ya?
                selectFirstScenarioTab()
            }
        })
    }

    
    document.getElementById("saveScenarioButton").addEventListener("click", function(){
        widow.scenarios.saveScenarioByName(activeTabAndView.getScenario().getName())
    })

    document.getElementById("runScenarioButton").addEventListener("click", function(){
        widow.scenarios.runScenarioByName(activeTabAndView.getScenario().getName())
    })
}

function selectScenarioTab(scenario){
    //Guard
    if (scenario==null){
        //TODO: Throw
        return
    }
    try{
        scenarioTabAndViews[scenario.getName()].select()
    }catch{
        print("Unable to select scenario tab")
    }
}

function selectFirstScenarioTab(){
    for (scenarioName in scenarioTabAndViews){
        scenarioTabAndViews[scenarioName].select()
        break;
    }
}

//======================
// Open Window
//======================

/**
 * function openWindow
 * @description Opens a new window with an address relative to main.js
 * @param {string} address Address of page to load on the view
 * @param {number} width Width dimension of the window
 * @param {number} height Height dimension of the window
 * @param {boolean} modal Boolean for if to make the window modal
 */
function openWindow(address, width, height, resizable, modal){
    
    electron.ipcRenderer.send("openChildWindow", address, width, height, resizable, modal)
}

//======================
// Toast
//======================

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


/**
 * @function getActiveScenarioTab
 * @description Returns the ScenarioTabAndView which is in focus.
 * 
 */
function getActiveScenarioTab(){
    return activeTabAndView
}