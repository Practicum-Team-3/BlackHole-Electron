function ScenarioTabAndView(scenario, tabBarNode, scenarioViewsNode){
    this.scenario = scenario
    var netGraph = null
    var machineInfo = null
    
    //create a single scenario view (a div node)
    var scenarioViewNode = document.createElement("div")
    scenarioViewNode.className = "tab-pane fade scenarioView"
    scenarioViewNode.id = generateUniqueId()
    
    //this gets real
    scenarioViewsNode.appendChild(scenarioViewNode)
    
    //Then make the tab
    var tabNode = createTab(tabBarNode, scenario.getName(), "#"+scenarioViewNode.id)
    
    //Go deeper into the creation for inner sections
    createMainSectionsForScenarioView()
    
    //Fill machine info fields with the first victim machine for now
    //TODO: Make this smarter
//    if (scenario.getAllVictimMachines().length>0){
//        var machine = scenario.getAllVictimMachines()[0]
//
//        fillMachineInfo(machine, centralView)
//    }
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
        machineInfo = new MachineInfo(this.scenario, machineInfoNode)

        //This gets real (Add to centralView's dom)
        scenarioViewNode.appendChild(machineInfoNode)
    }
    
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

        $(tabLink).tab('show')

        return tabNode
    }
}
