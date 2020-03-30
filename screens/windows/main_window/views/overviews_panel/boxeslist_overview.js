/**
 * @class Overview
 * @description Model for the overview panel
 */
function BoxesListOverview(boxesListNode){

    this.nameForTabLabel = "BoxesList"
    this.boxesListNode = boxesListNode
    this.boxesObject = null

    var sectionsContainer = document.createElement("div")
    sectionsContainer.className = "fillSpace columnFlex BoxesListOverviewSectionsContainer"

    this.interface = new NodeCombos(sectionsContainer)

    var sections = ["boxesListCollapsibles", "boxesListOptions"]
    this.interface.addMultipleSections(sections)

    //populate the collapsibles
    this.interface.selectNode(this.interface.getNodes()["boxesListCollapsibles"])
    this.interface.getNodes()["boxesListCollapsibles"].style = "overflow-y:scroll; overflow-x:hidden"
    this.interface.getNodes()["boxesListCollapsibles"].className = "stretchFlex boxesListCollapsibles bg-light"

    // Create a form to put all of the components in
    var formNode = document.createElement("form")
    // formNode.style = "background-color:red"
    formNode.className = "boxesListCollapsiblesForm"
    formNode.setAttribute("onSubmit", "return false")

    this.interface.addReferenceToNode(formNode.className, formNode)
    this.interface.getNodes()["boxesListCollapsibles"].appendChild(formNode)

    this.interface.selectNode(this.interface.getNodes()["boxesListCollapsiblesForm"])

    this.interface.selectNode(this.interface.getNodes()["boxesListOptions"])
    //this.interface.getNodes()["boxesListOptions"].style = "height:20%;"
    this.interface.getNodes()["boxesListOptions"].className = "fixedFlex container boxesListOptions bg-dark"

    var optionButtons = {"Create Box_primary":function(){showToast("Create Box", "Not yet implemented")}, "Upload Box_info":function(){showToast("Upload Box", "Not yet implemented")}}
    this.interface.addOverviewOptionsButtons(optionButtons)
    
    this.boxesListNode.appendChild(sectionsContainer)


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
        this.boxesListNode = element
    }

    //NAMES MUST BE UNIQUE, graph will break if box names are duplicated.
    this.includeClicked = function(i){

        var boxName = this.boxesObject.getBoxesList()[i]
        boxName = boxName.replace(/\//gi, '-').split(".").join("-")

        // showToast("Include Node", "Implemented but disabled")
        netGraphs[getActiveScenarioTab().getScenario().getName()].addNewNode(boxName, "victim")
    }
}

/**
 * @function setBoxes
 * @description Take the list of boxes from the server and populate the list.
 * @param {Boxes} boxesList Boxes object to use
 */
BoxesListOverview.prototype.setBoxes = function(boxesObject){
    this.clear()
    this.boxesObject = boxesObject
    // this.boxesObject.onModified(this.update.bind(this))
    this.update()
}

/**
 * @function clear
 * @description Call to unassign the scenario from the machine info
 */
BoxesListOverview.prototype.clear = function(){
    if (this.boxesObject==null){
        return
    }
    this.boxesObject.removeOnModifiedListener(this.update)
    this.boxesObject = null

    //clear collapsibles
    var formContainer = this.interface.getNodes()["boxesListCollapsiblesForm"]
    var containerChildren = formContainer.children

    for(var i = 0; i<containerChildren.length;i++){
        formContainer.removeChild(containerChildren[i])
    }
}

BoxesListOverview.prototype.update = function(){
    if (this.boxesObject==null){
        return
    }

    //get boxesList should return a list of JSON objects with more details for each box than just OS
    var boxesArray = this.boxesObject.getBoxesList()

    this.interface.selectNode(this.interface.getNodes()["boxesListCollapsiblesForm"])

    //populate the form
    for(var i = 0;i<boxesArray.length;i++){
        this.interface.addCollapsibleGroup(boxesArray[i], "server")
        // General details
        this.interface.addLabelPair(null, "Name:", "boxName", boxesArray[i])
        this.interface.addLabelPair(null, "OS:", "boxOs", boxesArray[i])
        this.interface.addLabelPair(null, "Exploits:", "boxInstalledExploits", "")
        this.interface.addLabelPair(null, "Programs:", "boxInstalledPrograms", "")

        this.interface.addDeleteAndIncludeButtons(null, function(){showToast("DeleteOnServer", "Not implemented")}, null, this.includeClicked.bind(this, i))
        this.interface.selectNode(this.interface.getNodes()["boxesListCollapsiblesForm"])
    }
}

BoxesListOverview.prototype.onchange = function(nodeName, node){
    console.log(nodeName)
}
