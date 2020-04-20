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
        // var machineName = this.boxesObject.getBoxesList()[i]
        // machineName = machineName.replace(/\//gi, '-').split(".").join("-")

        // // showToast("Include Node", "Implemented but disabled")
        // getActiveScenarioTab().getNetGraph().addNewNode(machineName)
        
        // \/ \/ \/ \/ \/ \/ \/ \/
        
        var machines = getActiveScenarioTab().getScenario().machines
        
        // Prepare name and box
        var machineName = machines.getMachineByName("untitled")==null ? "untitled" : "untitled-"+generateUniqueId()
        var box = this.boxesObject.getBoxesList()[i]

        var newMachine = machines.createNewMachine(machineName, box)

        // Check if machine was created, and tell the guys about it
        if (newMachine!=null){
            emitModifiedEvent(machines, null, modificationTypes.ADDED_ELEMENT, newMachine)
        }else{
            console.log("BoxesListOverview: Unable to include machine")
        }
        
        // /\ /\ /\ /\ /\ /\ /\ /\
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
    console.log("Boxes on server:")
    console.log(this.boxesObject.getBoxesList())
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
    console.log("Inside boxoverview, removing: " + boxName)
    widow.boxes.removeBox(boxName)
    .then(function(response){
        console.log("back in boxeslist overview")
        widow.boxes.requestTaskProgress(response.data.task_id, null, this.onChange.bind(this))
    }.bind(this))
    .catch(function(error){
        console.log(error)
        console.log("An error ocurred on server, couldn't remove box '" + boxName + "'")
    })
}

BoxesListOverview.prototype.onChange = function(modificationType, argA){
    console.log("On change was called")
    widow.boxes.load()
    .then(function(){
        this.setBoxes(widow.boxes)
    }.bind(this))
    .catch(function(){
        console.log("error updating GUI")
    })
}
