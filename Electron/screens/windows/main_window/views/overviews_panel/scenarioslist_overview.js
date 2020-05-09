/**
 * @class Overview
 * @description Model for the overview panel
 */
function ScenariosListOverview(scenariosListNode){
    this.nameForTabLabel = "ScenariosList"
    this.scenariosListNode = scenariosListNode
    this.scenariosObject = null
    var sectionsContainer = document.createElement("div")
    sectionsContainer.className = "fillSpace columnFlex ScenariosListOverviewSectionsContainer"
    
    // Weak map to keep references to section nodes
    this.scenarioSections = new WeakMap();

    this.interface = new NodeCombos(sectionsContainer)

    //
    var sections = ["scenariosListCollapsibles", "scenariosListOptions"]
    this.interface.addMultipleSections(sections)
    //populate the collapsibles
    this.interface.selectNode(this.interface.getNode("scenariosListCollapsibles"))
    this.interface.getNode("scenariosListCollapsibles").style = "overflow-y:scroll; overflow-x:hidden"
    this.interface.getNode("scenariosListCollapsibles").className = "stretchFlex scenariosListCollapsibles bg-light"

    // Create a form to put all of the components in
    var formNode = document.createElement("form")
    formNode.className = "scenariosListCollapsiblesForm"
    formNode.id = "scenarioListForm"
    formNode.setAttribute("onSubmit", "return false")

    this.interface.addReferenceToNode(formNode.className, formNode)
    this.interface.getNode("scenariosListCollapsibles").appendChild(formNode)
    this.interface.selectNode(this.interface.getNode("scenariosListOptions"))
    this.interface.getNode("scenariosListOptions").className = "fixedFlex container scenariosListOptions bg-dark"

    var optionButtons = { "Create Scenario_primary": function () { openWindow('./screens/windows/dialogs/new_scenario/create_scenario.html', 530, 355, false, true)}, "Upload Scenario_info":function(){showToast("Upload Scenario", "Not yet implemented")}}
    
    this.interface.addOverviewOptionsButtons(optionButtons)
    
    this.scenariosListNode.appendChild(sectionsContainer)


    //-------------------------------------------
    
    /**
     * @function removeScenario
     * @description Called by delete button, to delete a scenario
     * @param {Scenario} scenario
     */
    this.removeScenario = function(scenario){
       
        var strScenarioName = scenario.getName()
        const { dialog } = require('electron').remote
        
        //Minimum options object
        let options = {
            buttons: ["Cancel","Yes"],
            message: "Do you really want to delete Scenario " + strScenarioName + "?"
        }
        
        //Synchronous usage
        let response = dialog.showMessageBoxSync(options)
        console.log(response)
        
        if (response == 1){
            emitModifiedEvent(scenario, null, modificationTypes.DESTROYED)
            widow.scenarios.removeScenarioByName(strScenarioName)
            emitModifiedEvent(widow.scenarios, null, modificationTypes.REMOVED_ELEMENT, scenario)
        }
    }

    /**
     * function editFields
     * @description Called by the edit button, to edit scenario details
     * @param {Scenario} scenario
     */
    this.editFields = function(scenario){
        openWindow('./screens/windows/dialogs/new_scenario/create_scenario.html', 530, 355, false, true, false, ["SCENARIO_EDIT="+scenario.getName()+";"+scenario.getDescription()])
    }
}

//=====================================
//=====================================

/**
 * @function setScenarios
 * @description Take the list of scenarios from the server and populate the list.
 * @param {Scenarios} scenariosList scenarios object to use
 */
ScenariosListOverview.prototype.setScenarios = function (scenariosObject){
    this.clear()
    this.scenariosObject = scenariosObject

    this.onScenariosModified = this.scenariosModified.bind(this);
    onModified(this.scenariosObject, this.onScenariosModified)
    this.addScenarioSectionsForAll()
}

/**
 * @function clear
 * @description Call to clear internals before removing nodes
 */
ScenariosListOverview.prototype.clear = function(){
    if (this.scenariosObject==null){
        return
    }
    //removeOnModifiedListener(this.scenariosObject, this.update)
    this.scenariosObject = null

    //clear collapsibles
    var formContainer = this.interface.getNode("scenariosListCollapsiblesForm")
    var containerChildren = formContainer.children

    for(var i = 0; i<containerChildren.length;i++){
        formContainer.removeChild(containerChildren[i])
    }
}

/**
 * @function addScenarioSectionsForAll
 * @description Makes repeated calls to addScenarioSection() to add sections for all scenarios in the scenario list
 */
ScenariosListOverview.prototype.addScenarioSectionsForAll = function(){
    if (this.scenariosObject==null){
        return
    }

    //get scenariosList should return a list of JSON objects with more details for each box than just OS    
    var scenariosArray = this.scenariosObject.getAllScenarios()

    this.interface.selectNode(this.interface.getNode("scenariosListCollapsiblesForm"))

    //populate the form
    for (var i = 0; i <scenariosArray.length;i++){
        this.addScenarioSection(scenariosArray[i])
    }
}

/**
 * @function addScenarioSection
 * @description Adds a section corresponding to a scenario
 * @param   {Scenario}   scenario Scenario to link this section to
 * @returns {DOMNode} The DOM-node of the group added for the scenario
 */
ScenariosListOverview.prototype.addScenarioSection = function(scenario){
    var group = this.interface.addCollapsibleGroup(scenario.getName(), scenario.getName(), "scroll", "#scenarioListForm")

    // Keep access to labels on group node
    group.labels = {}
    
    // General details
    group.labels.getName = this.interface.addLabelPair(null, "Name:", "scenarioName", scenario.getName()).rightLabel
    group.labels.getDescription = this.interface.addLabelPair(null, "Description:", "scenarioDes", scenario.getDescription()).rightLabel
    group.labels.getCreationDate = this.interface.addLabelPair(null, "Creation Date:", "scenarioCreationDate", scenario.getCreationDate().toLocaleDateString()).rightLabel
    // This guy needs additional processing, so it doesn't conform to the superautomaticnamingpractice
    group.labels.lastAccessed = this.interface.addLabelPair(null, "Last Accessed:", "scenarioLastAccessed", scenario.getLastAccessed().toLocaleDateString()).rightLabel
    group.labels.machineCount = this.interface.addLabelPair(null, "No. Machines:", "scenarioNoMachines", scenario.machines.getAllMachines().length).rightLabel
    //group.labels.status = this.interface.addLabelPair(null, "Status:", "scenarioStatus", "Running").rightLabel
    var strScenarioName = scenario.getName();
    this.interface.addEditDeleteButtons(null, this.editFields.bind(this, scenario), null, this.removeScenario.bind(event, scenario))
    this.interface.addOpenButton("openScenarioButton", openScenario.bind(event, scenario), "")
    this.interface.selectNode(this.interface.getNode("scenariosListCollapsiblesForm"))
    
    // Add mapping to be able to retrieve later
    this.scenarioSections.set(scenario, group)
    
    // Subscribe to scenario modifications
    onModified(scenario, this.scenarioModified.bind(this))
    
    return group
}

/**
 * @function rmeoveScenarioSection
 * @description Removes the section corresponding to a scenario
 * @param {Scenario} scenario Scenario of the section to remove
 */
ScenariosListOverview.prototype.removeScenarioSection = function (scenario) {
    // Retrieve the group node from the map
    var group = this.scenarioSections.get(scenario)
    
    group.remove();
    
    // No need to unsubscribe from modifications
    // the whole scenario got removed!
    
    // Remove mapping to group node
    this.scenarioSections.delete(scenario)
}

/**
 * @function scenariosModified
 * @description Callback for when the scenarios object in widow gets modified
 */
ScenariosListOverview.prototype.scenariosModified = function(target, modificationType, arg){
    
    switch(modificationType){
        case modificationTypes.ADDED_ELEMENT:
            var group = this.addScenarioSection(arg)
            $(group.lastChild).collapse('show')
            
            openScenario(arg)
            break;

        case modificationTypes.REMOVED_ELEMENT:
            var group = this.removeScenarioSection(arg)
            break;
    }
}

/**
 * @function scenarioModified
 * @description Callback for when a single specific scenario is modified
 */
ScenariosListOverview.prototype.scenarioModified = function(target, modificationType, arg){
    // Retrieve the group node from the map
    var group = this.scenarioSections.get(target)
    
    switch(modificationType){
        case modificationTypes.EDITED:
            // Check if modification conforms to the superautomaticnamingpractice
            if (group.labels[arg]!=null && target[arg]!=null){
                group.labels[arg].innerText = target[arg]()
            }
            
            // Special actions & non-conforming fields
            switch (arg){
                case "getName"://Also need to change group title
                    group.titleNode.innerText = target.getName()
                break
                case "getLastAccessed":
                    group.labels.lastAccessed.innerText = target.getLastAccessed().toLocaleDateString()
                break
                
            }
        break;
    }
}
