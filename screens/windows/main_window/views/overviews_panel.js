

function OverviewsPanel(overviewsList, overviewsPanelNode){
    var self = this

    this.navTabNodesList = {}
    
    this.overviewsPanelNode = overviewsPanelNode
    this.overviewsPanelNode.style.display = "flex"
    this.overviewsPanelNode.style.flexGrow = 0.4
    this.overviewsPanelNode.style.backgroundColor = "green"

    //create a vertical tabBar
    this.overviewsPanelTabsBar = document.createElement("div")
    this.overviewsPanelTabsBar.className = "bg-secondary overviewsPanelTabsBar"
    // this.overviewsPanelTabsBar.id = generateUniqueId()
    this.overviewsPanelTabsBar.style.flexGrow = 0.1

    this.unorderedList = document.createElement("ul")
    this.unorderedList.className = "nav-tabs tabs-left vertical-text pl-2 pt-2"

    // // //create and append the tab nodes using the tab labels
    for(var i = 0; i<overviewsList.length; i++){
        
        var li = document.createElement("li")
        li.className = "nav-item"

        var a = document.createElement("a")
        a.className = "nav-link"
        a.id = "nav-" + overviewsList[i].getTabLabel() + "-tab"
        a.href = "#nav-" + overviewsList[i].getTabLabel()
        a.setAttribute("data-toggle", "tab")
        a.setAttribute("role", "tab")
        a.innerHTML = overviewsList[i].getTabLabel()

        li.appendChild(a)
        this.unorderedList.appendChild(li)
    }

    this.overviewsPanelTabsBar.appendChild(this.unorderedList)
    
    // //create a single scenario view (a div node)
    // var panelNode = document.createElement("div")
    // overviewsPanelNode.className = "tab-pane scenarioView"
    // overviewsPanelNode.id = generateUniqueId()
    
    //this gets real
    this.overviewsPanelNode.appendChild(this.overviewsPanelTabsBar)
    
    // //Then make the tab
    // var tabNode = createTab(tabBarNode, scenario.getName(), "#"+scenarioViewNode.id)
    
    // //Go deeper into the creation for inner sections
    // createMainSectionsForScenarioView()
    
    
    // /**
    //  * @function createMainSectionsForScenarioView
    //  * @description Adds the inner sections for the scenario view
    //  *                  such as the network graph and the machine info panel
    //  */
    // function createMainSectionsForScenarioView(){
    //     //Make network graph space===
    //     var netGraphNode = document.createElement("div")
    //     netGraphNode.className = "networkGraphContainer"
    //     netGraphNode.setAttribute("style", "flex-grow: 3")
    //     //create referencer object and save
    //     netGraph = new NetGraph(this.scenario, netGraphNode)

    //     //This gets real (Add to centralView's node)
    //     scenarioViewNode.appendChild(netGraphNode)

    //     //Make machine info===
    //     var machineInfoNode = document.createElement("div")
    //     machineInfoNode.className = "machineInfoContainer"
    //     machineInfoNode.setAttribute("style", "flex: 0 0 300px")
    //     //create referencer object and save
    //     machineInfo = new MachineInfo(machineInfoNode)
        
    //     machineInfo.setMachine(scenario.getAllAttackerMachines()[0])

    //     //This gets real (Add to centralView's dom)
    //     scenarioViewNode.appendChild(machineInfoNode)
    // }
    
    // /**
    //  * @function createTab
    //  * @description Generates the tab for the scenario view on the tab bar
    //  * @param   {object} tabBarNode Node of the tab bar (where tabs get added)
    //  * @param   {string} label      Label of the new tab
    //  * @param   {string} href       Link address for the tab
    //  * @returns {object} The node of the new tab
    //  */
    // function createTab(tabBarNode, label, href){
    //     let tabNode = document.createElement("li")
    //     tabNode.className = "nav-item"

    //     let tabLink = document.createElement("a")
    //     tabLink.className = "nav-link"
    //     tabLink.setAttribute("data-toggle", "tab")
    //     tabLink.setAttribute("href", href)
    //     tabLink.innerHTML = label

    //     tabNode.appendChild(tabLink)
    //     tabBarNode.appendChild(tabNode)

        
    //     $(tabLink).on('shown.bs.tab', function(event){
    //         activeTabAndView = self
    //     });
    //     $(tabLink).tab('show')

    //     return tabNode
    // }
    
    // /**
    //  * @function getScenario
    //  * @description Returns the scenario assigned
    //  * @returns {Scenario} Scenario object assigned to this tab and view
    //  */
    // this.getScenario = function(){
    //     return scenario
    // }

    this.setWidth = function(percentWidth){
        this.overviewsPanelNode.style.flexGrow = percentWidth
    }
}