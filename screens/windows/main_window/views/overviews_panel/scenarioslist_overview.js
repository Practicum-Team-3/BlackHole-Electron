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
    formNode.setAttribute("onSubmit", "return false")

    this.interface.addReferenceToNode(formNode.className, formNode)
    this.interface.getNodes()["scenariosListCollapsibles"].appendChild(formNode)

    this.interface.selectNode(this.interface.getNodes()["scenariosListCollapsiblesForm"])

    this.interface.selectNode(this.interface.getNodes()["scenariosListOptions"])
    //this.interface.getNodes()["scenariosListOptions"].style = "height:20%;"
    this.interface.getNodes()["scenariosListOptions"].className = "fixedFlex container scenariosListOptions bg-dark"

    var optionButtons = {"Create Scenario_primary":function(){showToast("Create Scenario", "Not yet implemented")}, "Upload Scenario_info":function(){showToast("Upload Scenario", "Not yet implemented")}}
    this.interface.addOverviewOptionsButtons(optionButtons)
    
    this.scenariosListNode.appendChild(sectionsContainer)


    //-------------------------------------------
    this.getInterface = function(){
        return this.interface
    }
    
    this.getNode = function(nodeName){
        return this.getInterface().getNodes()[nodeName]
    }

    this.getTabLabel = function(){
        return this.nameForTabLabel
    }

    this.setNode = function(element){
        this.scenariosListNode = element
    }

    //NAMES MUST BE UNIQUE, graph will break if box names are duplicated.
    this.includeClicked = function(i){

        var boxName = this.scenariosObject.getScenariosList()[i]
        boxName = boxName.replace(/\//gi, '-').split(".").join("-")

        showToast("Include Node", "Implemented but disabled")
        // netGraph.addNewNode(boxName, "victim")
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
    //this.scenariosObject.onModified(this.update.bind(this))
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
    this.scenariosObject.removeOnModifiedListener(this.update)
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
        this.interface.addCollapsibleGroup(scenariosArray[i].getName(), "server")
        // General details
        this.interface.addLabelPair(null, "Name:", "scenarioName", scenariosArray[i].getName())
        this.interface.addLabelPair(null, "Description:", "scenarioDes", "I created this scenario to test crap.")
        this.interface.addLabelPair(null, "CreationDate:", "scenarioCreationDate", scenariosArray[i].getCreationDate().toLocaleDateString())
        this.interface.addLabelPair(null, "LastAccessed:", "scenarioLastAccessed", scenariosArray[i].getLastAccessed().toLocaleDateString())
        this.interface.addLabelPair(null, "No. Machines:", "scenarioNoMachines", scenariosArray[i].getAllMachines().length)
        this.interface.addLabelPair(null, "Status:", "scenarioStatus", "Running")
        var strScenarioName = scenariosArray[i].getName();
        this.interface.addEditDeleteButtons(null, openScenarioByName.bind(event, strScenarioName), null, function () { showToast("DeleteScenarioOnServer", "Delete Scenario was clicked") })
        this.interface.selectNode(this.interface.getNodes()["scenariosListCollapsiblesForm"])
    }
}

ScenariosListOverview.prototype.onchange = function(nodeName, node){
    console.log(nodeName)
}
