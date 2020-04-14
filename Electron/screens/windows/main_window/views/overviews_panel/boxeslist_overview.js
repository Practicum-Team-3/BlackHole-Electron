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

    var optionButtons = {"Add from vagrant_primary":function(){openWindow('./screens/windows/dialogs/new_box/add_from_vagrant.html', 530, 355, true, false)}, "Upload OVA_info":function(){showToast("Upload OVA", "Not yet implemented")}}
    // openWindow('./screens/windows/dialogs/new_box/add_from_vagrant.html', 530, 355, false, true)
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
        getActiveScenarioTab().getNetGraph().addNewNode(boxName, "victim")
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
    onModified(this.boxesObject, this.onChange.bind(this))
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
    removeOnModifiedListener(this.boxesObject, this.onChange)
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
    console.log("New box list:")
    console.log(boxesArray)

    this.interface.selectNode(this.interface.getNodes()["boxesListCollapsiblesForm"])

    //populate the form
    for(var i = 0;i<boxesArray.length;i++){
        this.interface.addCollapsibleGroup(null, boxesArray[i], "server")
        // General details
        this.interface.addLabelPair(null, "Name:", "boxName", boxesArray[i])
        this.interface.addLabelPair(null, "OS:", "boxOs", boxesArray[i])
        this.interface.addLabelPair(null, "Exploits:", "boxInstalledExploits", "")
        this.interface.addLabelPair(null, "Programs:", "boxInstalledPrograms", "")

        this.interface.addDeleteAndIncludeButtons(null, this.removeBox.bind(event, boxesArray[i]), null, this.includeClicked.bind(this, i))
        this.interface.selectNode(this.interface.getNodes()["boxesListCollapsiblesForm"])
    }
}

BoxesListOverview.prototype.removeBox = function(boxName){
    console.log("Removing box '" + boxName + "'...")
    widow.boxes.removeBox(boxName)
    .then(function(response){
        console.log("Box removed from server.")
        console.log("Updating GUI...")
        emitModifiedEvent(widow.boxes, null, modificationTypes.REMOVED_ELEMENT, null)
        console.log("Done.")
    }.bind(this))
    .catch(function(error){
        console.log(error)
        console.log("An error ocurred on server, couldn't remove box '" + boxName + "'")
    })
}

BoxesListOverview.prototype.onChange = function(modificationType, argA){
    this.clear()
    console.log("Updating boxeslistoverview...")
    this.update()
}
