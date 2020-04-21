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

    this.boxSections = {}

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

    this.onDeleteButtonClick = function(boxName){
        widow.boxes.removeBox(boxName)
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
    this.addBoxSection = function(boxName){
        //Select the area for the groups
        this.interface.selectNode(this.interface.getNode("boxesListCollapsiblesForm"))
        
        var group = this.interface.addCollapsibleGroup(null, boxName, "server")
        // General details of exploit
        this.interface.addLabelPair(null, "Box: ", "boxName", boxName)
        
        this.interface.addDeleteAndIncludeButtons(null, this.onDeleteButtonClick.bind(this, boxName), null, this.onIncludeButtonClick.bind(this, boxName))

        // keep reference to group node in map
        this.boxSections[boxName] = group
        
        // Select form again
        this.interface.selectNode(this.interface.getNode("boxesListCollapsiblesForm"))
        
        return group
    }.bind(this)


    this.removeBoxSection = function(boxName){
        var formNode = this.interface.getNode("boxesListCollapsiblesForm")
        formNode.removeChild(this.boxSections[boxName])
        this.boxSections.splice(this.boxSections.indexOf(boxName), 1)
    }.bind(this)


    this.loadBoxes = function(){
        return widow.boxes.load()
        .then(function(){
            // Create the groups for the available programs by calling addProgramSection()
            var boxes = widow.boxes.getBoxesList()
            for(var i = 0; i<boxes.length; i++){
                this.addBoxSection(boxes[i])
            }
        }.bind(this))
        .catch(function(error){
            console.log(error)
            console.log("An error occured while retrieving boxes from widow.")
        }.bind(this))
    }


    this.boxesModified = function(target, modificationType, arg){
        console.log("in boxesModified")
        
        switch(modificationType){
            // Added Program
            case modificationTypes.ADDED_ELEMENT:

                var group = this.addBoxSection(arg)
                $(group.lastChild).collapse('show')

                break;
            case modificationTypes.REMOVED_ELEMENT:
                console.log("REMOVED_ELEMENT")
                this.removeBoxSection(arg)
                break;
        }
    }.bind(this)

    onModified(widow.boxes, this.boxesModified.bind(this))
}






