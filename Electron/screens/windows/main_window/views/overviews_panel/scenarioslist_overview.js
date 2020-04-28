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

    this.interface = new NodeCombos(sectionsContainer)

    var sections = ["scenariosListCollapsibles", "scenariosListOptions"]
    this.interface.addMultipleSections(sections)
    //populate the collapsibles
    this.interface.selectNode(this.interface.getNodes()["scenariosListCollapsibles"])
    this.interface.getNodes()["scenariosListCollapsibles"].style = "overflow-y:scroll; overflow-x:hidden"
    this.interface.getNodes()["scenariosListCollapsibles"].className = "stretchFlex scenariosListCollapsibles bg-light"

    // Create a form to put all of the components in
    var formNode = document.createElement("form")
    // formNode.style = "background-color:red"
    formNode.className = "scenariosListCollapsiblesForm"
    formNode.id = "scenarioListForm"
    formNode.setAttribute("onSubmit", "return false")

    this.interface.addReferenceToNode(formNode.className, formNode)
    this.interface.getNodes()["scenariosListCollapsibles"].appendChild(formNode)

    this.interface.selectNode(this.interface.getNodes()["scenariosListCollapsiblesForm"])

    this.interface.selectNode(this.interface.getNodes()["scenariosListOptions"])
    //this.interface.getNodes()["scenariosListOptions"].style = "height:20%;"
    this.interface.getNodes()["scenariosListOptions"].className = "fixedFlex container scenariosListOptions bg-dark"

    var optionButtons = { "Create Scenario_primary": function () { openWindow('./screens/windows/dialogs/new_scenario/create_scenario.html', 530, 355, false, true)}, "Upload Scenario_info":function(){showToast("Upload Scenario", "Not yet implemented")}}
    
    this.interface.addOverviewOptionsButtons(optionButtons)
    
    this.scenariosListNode.appendChild(sectionsContainer)


    //-------------------------------------------
    this.getInterface = function(){
        return this.interface
    }

    this.removeScenarioSectionBound = this.removeScenarioSection.bind(this)

    this.getNode = function(nodeName){
        return this.getInterface().getNodes()[nodeName]
    }

    this.getTabLabel = function(){
        return this.nameForTabLabel
    }

    this.setNode = function(element){
        this.scenariosListNode = element
    }

    this.includeClicked = function(i){

        var boxName = this.scenariosObject.getScenariosList()[i]
        boxName = boxName.replace(/\//gi, '-').split(".").join("-")

        showToast("Include Node", "Implemented but disabled")
        // netGraph.addNewNode(boxName, "victim")
    }

    this.removeScenario = function(strScenarioName, scenario){
       
        //console.log("strScenarioName")
        const { dialog } = require('electron').remote
        
        //Minimum options object
        let options  = {
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
}


/**
 * @function setScenarios
 * @description Take the list of scenarios from the server and populate the list.
 * @param {Scenarios} scenariosList scenarios object to use
 */
ScenariosListOverview.prototype.setScenarios = function (scenariosObject){
    this.clear()
    this.scenariosObject = scenariosObject
    //console.log(scenariosObject.getAllScenarios());
    //onModified(this.scenariosObject, this.scenariosModified.bind(this))
    this.onScenarioModified = this.scenariosModified.bind(this);
    onModified(this.scenariosObject, this.onScenarioModified)
    this.update()
}

/**
 * @function clear
 * @description Call to unassign the scenario from the machine info
 */
ScenariosListOverview.prototype.clear = function(){
    if (this.scenariosObject==null){
        return
    }
    removeOnModifiedListener(this.scenariosObject, this.update)
    this.scenariosObject = null

    //clear collapsibles
    var formContainer = this.interface.getNodes()["scenariosListCollapsiblesForm"]
    var containerChildren = formContainer.children

    for(var i = 0; i<containerChildren.length;i++){
        formContainer.removeChild(containerChildren[i])
    }
}

ScenariosListOverview.prototype.update = function(){
    if (this.scenariosObject==null){
        return
    }

    //get scenariosList should return a list of JSON objects with more details for each box than just OS    
    var scenariosArray = this.scenariosObject.getAllScenarios()

    this.interface.selectNode(this.interface.getNodes()["scenariosListCollapsiblesForm"])

    //populate the form
    for (var i = 0; i <scenariosArray.length;i++){
        this.addScenarioSection(scenariosArray[i])
    }
}

ScenariosListOverview.prototype.addScenarioSection = function(scenario){
    var group = this.interface.addCollapsibleGroup(scenario.getName(), scenario.getName(), "scroll", "#scenarioListForm")
    // General details
    this.interface.addLabelPair(null, "Name:", "scenarioName", scenario.getName())

    this.interface.addLabelPair(null, "Description:", "scenarioDes", scenario.getDescription())
    this.interface.addLabelPair(null, "CreationDate:", "scenarioCreationDate", scenario.getCreationDate().toLocaleDateString())
    this.interface.addLabelPair(null, "LastAccessed:", "scenarioLastAccessed", scenario.getLastAccessed().toLocaleDateString())
    this.interface.addLabelPair(null, "No. Machines:", "scenarioNoMachines", scenario.getAllMachines().length)
    this.interface.addLabelPair(null, "Status:", "scenarioStatus", "Running")
    var strScenarioName = scenario.getName();
    this.interface.addOpenEditButtons(null, openScenarioByName.bind(event, strScenarioName), null, this.removeScenario.bind(event, strScenarioName, scenario))
    this.interface.selectNode(this.interface.getNode("scenariosListCollapsiblesForm"))
    
    return group
}

//Remove Scenarios
ScenariosListOverview.prototype.removeScenarioSection = function (scenario) {    
    var group = this.interface.getNode(scenario.getName());
    //console.log(group);
    group.remove();
    
}

ScenariosListOverview.prototype.scenariosModified = function(target, modificationType, arg){
    
    switch(modificationType){
        case modificationTypes.ADDED_ELEMENT:
            var group = this.addScenarioSection(arg)
            $(group.lastChild).collapse('show')
            
            openScenario(arg)
            break;

        case modificationTypes.REMOVED_ELEMENT:
            var group = this.removeScenarioSectionBound(arg)
            //$(group.lastChild).collapse('show')
            break;
    }
}
