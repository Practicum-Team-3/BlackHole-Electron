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

    this.boxSections = new WeakMap()

    var sections = ["boxesListCollapsibles", "boxesListOptions"]
    this.interface.addMultipleSections(sections)

    //populate the collapsibles
    this.interface.selectNode(this.interface.getNode("boxesListCollapsibles"))
    this.interface.getNode("boxesListCollapsibles").style = "overflow-y:scroll; overflow-x:hidden"
    this.interface.getNode("boxesListCollapsibles").className = "stretchFlex programListCollapsibles bg-light"

    // Create a form to put all of the components in
    var formNode = document.createElement("form")

    formNode.className = "boxesListCollapsiblesForm"
    formNode.setAttribute("onSubmit", "return false")

    this.interface.addReferenceToNode(formNode.className, formNode)
    this.interface.getNode("boxesListCollapsibles").appendChild(formNode)

    this.interface.selectNode(this.interface.getNodes()["boxesListCollapsiblesForm"])
    this.interface.selectNode(this.interface.getNodes()["boxesListOptions"])
    this.interface.getNodes()["boxesListOptions"].className = "fixedFlex container boxesListOptions bg-dark"
    var optionButtons = {"Add from vagrant_primary":function(){openWindow('./screens/windows/dialogs/new_box/add_from_vagrant.html', 530, 355, true, false)}, "Upload OVA_info":function(){showToast("Upload OVA", "Not yet implemented")}}
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
    // this.includeClicked = function(i){
        
    //     var machines = getActiveScenarioTab().getScenario().machines
        
    //     // Prepare name and box
    //     var machineName = machines.getMachineByName("untitled")==null ? "untitled" : "untitled-"+generateUniqueId()
    //     var box = this.boxesObject.getBoxesList()[i]

    //     var newMachine = machines.createNewMachine(machineName, box)

    //     // Check if machine was created, and tell the guys about it
    //     if (newMachine!=null){
    //         emitModifiedEvent(machines, null, modificationTypes.ADDED_ELEMENT, newMachine)
    //     }else{
    //         console.log("BoxesListOverview: Unable to include machine")
    //     }
        
    // }

    this.onDeleteButtonClick = function(boxToDelete){
        // event.target.disabled = true
        
        widow.boxes.removeBox(boxToDelete)
        .then(function(){
            emitModifiedEvent(widow.boxes, null, modificationTypes.REMOVED_ELEMENT, boxToDelete)
        }.bind(this)).catch(function(){
            console.log("Error while calling widow.boxes.removeBox()")
        })
    }
    
    this.onIncludeButtonClick = function(boxName){
        var machines = getActiveScenarioTab().getScenario().machines
        
        // Prepare name and box
        var machineName = machines.getMachineByName("untitled")==null ? "untitled" : "untitled-"+generateUniqueId()

        var newMachine = machines.createNewMachine(machineName, boxName)

        // Check if machine was created, and tell the guys about it
        if (newMachine!=null){
            emitModifiedEvent(machines, null, modificationTypes.ADDED_ELEMENT, newMachine)
        }else{
            console.log("BoxesListOverview: Unable to include box " + boxName)
        }
    }

    // Define the function that adds box sections
    this.addBoxSection = function(boxName, box){
        //Select the area for the groups
        this.interface.selectNode(interface.getNode("boxesListCollapsiblesForm"))
        
        var group = interface.addCollapsibleGroup(null, boxName, "server")
        // General details of exploit
        this.interface.addLabelPair(null, "Name: ", "programName", boxName)
        this.interface.addLabelPair(null, "Description: ", "programTarget", box.getDescription())
        
        this.interface.addDeleteAndIncludeButtons(null, this.onDeleteButtonClick.bind(this, box), null, this.onIncludeButtonClick.bind(this, box))

        // keep reference to group node in map
        boxSections.set(box, group)
        
        // Select form again
        interface.selectNode(interface.getNode("boxesListCollapsiblesForm"))
        
        return group
    }.bind(this)


    this.removeBoxSection = function(box){
        boxSections.get(box).remove()
        boxSections.delete(box)
    }.bind(this)
    
    // Create the groups for the available programs by calling addProgramSection()
    var boxes = widow.boxes.getBoxesList()
    for(var key in boxes){
        this.addBoxSection(key, boxes[key])
    }

    this.boxesModified = function(target, modificationType, arg){
        
        switch(modificationType){
            // Added Program
            case modificationTypes.ADDED_ELEMENT:
                
                var group = this.addBoxSection(arg.getName(), arg)
                $(group.lastChild).collapse('show')
                
                break;
            case modificationTypes.REMOVED_ELEMENT:
                
                this.removeBoxSection(arg)
                
                break;
        }
    }.bind(this)

    // /**
    //  * @function loadBoxes
    //  * @description Take the list of boxes from widow and populate the list.
    //  */
    // this.loadBoxes = function(){
    //     // console.log("boxeslist overview, setBoxes called")
    //     this.clear()
    //     this.update()
    // }


    // /**
    //  * @function clear
    //  * @description Call to unassign the scenario from the machine info
    //  */
    // this.clear = function(){

    //     //clear collapsibles
    //     var formContainer = this.interface.getNodes()["boxesListCollapsiblesForm"]
    //     var containerChildren = formContainer.children

    //     console.log("number of children in container: " + containerChildren.length)

    //     if(containerChildren.length > 0){
    //         for(var i = 0; i<containerChildren.length;i++){
    //             formContainer.removeChild(containerChildren[i])
    //         }
    //     }else{
    //         console.log("BoxesList already contains no children")
    //     }
    // }


    // this.update = function(){
    //     console.log("update called")
    //     widow.boxes.load()
    //     .then(function(){

    //         //get boxesList should return a list of JSON objects with more details for each box than just OS
    //         var boxesArray = widow.boxes.getBoxesList()

    //         console.log("boxeslist to be populated with:")
    //         for(var i  = 0; i<boxesArray.length; i++){
    //             console.log(boxesArray[i])
    //         }
        
    //         this.interface.selectNode(this.interface.getNodes()["boxesListCollapsiblesForm"])
        
    //         //populate the form
    //         for(var i = 0;i<boxesArray.length;i++){
        
    //             this.interface.addCollapsibleGroup(null, boxesArray[i], "server")
    //             // General details
    //             this.interface.addLabelPair(null, "Name:", "boxName", boxesArray[i])
    //             this.interface.addLabelPair(null, "OS:", "boxOs", boxesArray[i])
    //             this.interface.addLabelPair(null, "Exploits:", "boxInstalledExploits", "")
    //             this.interface.addLabelPair(null, "Programs:", "boxInstalledPrograms", "")
        
    //             this.interface.addDeleteAndIncludeButtons(null, this.removeBoxClicked.bind(this, boxesArray[i]), null, this.includeClicked.bind(this, boxesArray[i]))
    //             this.interface.selectNode(this.interface.getNodes()["boxesListCollapsiblesForm"])
    //         }

    //     }.bind(this))
    //     .catch(function(){
    //         console.log("Error ocurred while attempting to update boxes")
    //     }.bind(this))
    // }

    // this.emitEvent = function(eventType){
    //     emitModifiedEvent(widow.boxes, null, eventType, null)
    // }

    // this.removeBoxClicked = function(boxName){
    //     console.log("Removing box: " + boxName)
    //     widow.boxes.removeBox(boxName, null, this.emitEvent.bind(this, modificationTypes.REMOVED_ELEMENT))
    // }

    // this.boxesModified = function(target, modificationType, arg){
        
    //     switch(modificationType){
    //         // Added BOx
    //         case modificationTypes.ADDED_ELEMENT:
    //             console.log("boxesModified.ADDED_ELEMENT")
    //             this.loadBoxes()
    //             break;
    //         case modificationTypes.REMOVED_ELEMENT:
    //             console.log("boxesModified.REMOVED_ELEMENT")
    //             this.loadBoxes()
    //             break;
    //     }
    // }.bind(this)

    onModified(widow.boxes, this.boxesModified.bind(this))
}






