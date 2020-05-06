var tabBarNode = null
var scenarioViewsNode = null
var overviewsPanel = null
// To store references to central views indexed by scenario name
var scenarioTabAndViews = {}
const { dialog } = require('electron').remote

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

function closeScenario(scenario){
    var tabAndView = scenarioTabAndViews[scenario.getName()]
    if (tabAndView!=null){
        tabAndView.close()
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
function openWindow(address, width, height, resizable, modal, frameless, arguments=[]){
    
    electron.ipcRenderer.send("openChildWindow", address, width, height, resizable, modal, undefined, undefined, frameless, arguments)
}

/**
 * @function openBrowserWindow
 * @description Opens a child window with restricted preferences for loading an external site.
 * @param {string} address Address of site to load
 */
function openBrowserWindow(address){
    electron.ipcRenderer.send("openChildWindow", address, 1000, 600, true, false, true, true)
}

//======================
// Specialized windows
//======================
function installProgram(programToInstall){
    var scenarioTab = getActiveScenarioTab()
    var selectedMachine
    if (scenarioTab!=null){
        selectedMachine = scenarioTab.getSelectedMachine()
        
        //Check if not already installed
        if (selectedMachine.programs.getProgramsByName(programToInstall.getName()).length>0){
            dialog.showErrorBox("Already Included", "This program is already included on "+selectedMachine.getName())
            return
        }
        
        
        if (selectedMachine!=null){
            //Store the machine in the pocket so the installed program setup can retrieve
            selectedMachine.hold()
            
            openWindow('./screens/windows/dialogs/component_settings/program.html', 530, 225, false, true, false, ["--edit-mode=install", "--program-name="+programToInstall.getName()])
        }else{
            dialog.showErrorBox("No machine selected", "Please select a machine to continue")
        }
    }else{
        dialog.showErrorBox("No scenario opened", "Please open a scenario to continue")
    }
}

function editInstalledProgram(machine, programName){
    machine.hold()
    openWindow('./screens/windows/dialogs/component_settings/program.html', 530, 225, false, true, false, ["--edit-mode=modify", "--program-name="+programName])
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
    $('.toastMessage').toast('show');
    document.getElementById("toastHeader").innerHTML = title
    document.getElementById("toastBody").innerHTML = message
}

/**
 * @function showProgressToast
 * @description Shows a brief message to the user
 * @param {string} title   Title of the message
 * @param {string} message Content of the message
 */
function showProgressToast(title, message){
    $('.toastProgress').toast('show');
    document.getElementById("toastProgressHeader").innerHTML = title
    document.getElementById("toastProgressBody").innerHTML = message
}

function setToastProgressBar(percent){
    setProgressBarPercent(percent, "toastProgressBar")
}


/**
 * @function runScenario
 * @description Calls prepares machines and runs the scenario on widow
 */
function runScenario(event){
    if (activeTabAndView==null){
        return
    }
    var scenarioName = activeTabAndView.getScenario().getName()
    //Feedback
    showToast("Run...", "Preparing to run scenario: "+scenarioName)
    
    function runFinished(){
        $('.toastProgress').toast('hide');
        showToast("Done", "Scenario run complete: "+scenarioName)
    }
    
    widow.scenarios.runScenarioByName(scenarioName, setToastProgressBar, runFinished)
    .then(function(){
        showProgressToast("Running", "Running scenario: "+scenarioName)
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
    var scenarioName = activeTabAndView.getScenario().getName()
    //Feedback
    showToast("Saving", "Saving scenario: "+scenarioName)
    
    widow.scenarios.saveScenarioByName(scenarioName)
    .then(function(){
        showToast("Saved", "Finished saving scenario: "+scenarioName)
    })
    .catch(function(){
        showToast("Error", "Failed to save scenario: "+scenarioName)
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