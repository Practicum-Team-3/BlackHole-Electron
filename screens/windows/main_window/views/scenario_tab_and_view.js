var activeTabAndView = null

/**
 * @class ScenarioTabAndView
 * @description Model class for a tab-controlled scenario view
 * @param   {Scenario} scenario          Scenario to handle on the tab controlled view
 * @param   {object} tabBarNode        Node of the tab bar
 * @param   {object} scenarioViewsNode Node where scenario views get added
 */
function ScenarioTabAndView(scenario, tabBarNode, scenarioViewsNode){
    var self = this
    var scenario = scenario
    var netGraph = null
    var machineInfo = null
    
    //create a single scenario view (a div node)
    var scenarioViewNode = document.createElement("div")
    scenarioViewNode.className = "tab-pane scenarioView"
    scenarioViewNode.id = generateUniqueId()
    
    //this gets real
    scenarioViewsNode.appendChild(scenarioViewNode)
    
    //Then make the tab
    var tabNode = createTab(tabBarNode, scenario.getName(), "#"+scenarioViewNode.id)
    
    //Go deeper into the creation for inner sections
    createMainSectionsForScenarioView()
    
    
    /**
     * @function createMainSectionsForScenarioView
     * @description Adds the inner sections for the scenario view
     *                  such as the network graph and the machine info panel
     */
    function createMainSectionsForScenarioView(){
        //Make network graph space===
        var netGraphNode = document.createElement("div")
        netGraphNode.className = "networkGraphContainer"
        netGraphNode.setAttribute("style", "flex-grow: 3")
        //create referencer object and save
        netGraph = new NetGraph(this.scenario, netGraphNode)

        //This gets real (Add to centralView's node)
        scenarioViewNode.appendChild(netGraphNode)

        //Make machine info===
        var machineInfoNode = document.createElement("div")
        machineInfoNode.className = "machineInfoContainer"
        machineInfoNode.setAttribute("style", "flex: 0 0 300px")
        //create referencer object and save
        machineInfo = new MachineInfo(machineInfoNode)
        
        machineInfo.setMachine(scenario.getAllAttackerMachines()[0])

        //This gets real (Add to centralView's dom)
        scenarioViewNode.appendChild(machineInfoNode)
    }
    
    /**
     * @function createTab
     * @description Generates the tab for the scenario view on the tab bar
     * @param   {object} tabBarNode Node of the tab bar (where tabs get added)
     * @param   {string} label      Label of the new tab
     * @param   {string} href       Link address for the tab
     * @returns {object} The node of the new tab
     */
    function createTab(tabBarNode, label, href){
        let tabNode = document.createElement("li")
        tabNode.className = "nav-item"

        let tabLink = document.createElement("a")
        tabLink.className = "nav-link"
        tabLink.setAttribute("data-toggle", "tab")
        tabLink.setAttribute("href", href)
        tabLink.innerHTML = label

        tabNode.appendChild(tabLink)
        tabBarNode.appendChild(tabNode)

        
        $(tabLink).on('shown.bs.tab', function(event){
            activeTabAndView = self
        });
        $(tabLink).tab('show')

        return tabNode
    }
    
    /**
     * @function getScenario
     * @description Returns the scenario assigned
     * @returns {Scenario} Scenario object assigned to this tab and view
     */
    this.getScenario = function(){
        return scenario
    }
    
    /**
     * @function close
     * @description Call to perform cleanup before closing the tab and view
     */
    this.close = function(){
        
        machineInfo.clear()
    }
}