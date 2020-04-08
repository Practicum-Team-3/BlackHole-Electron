const programListOverviewTypes = {
    VULNERABILITIES: {
        origin: "getAllNonExploits",
        modificationLookout: "getIsExploit",
        iconLigature: "bug",
        uploadButtonLabel: "Upload Program"
    },
    EXPLOITS: {
        origin: "getAllExploits",
        modificationLookout: "getIsExploit",
        iconLigature: "bomb",
        uploadButtonLabel: "Upload Exploit"
    }
}

/**
 * @class ProgramOverview
 * @description Program List in the overview panel
 */
function ProgramListOverview(programListNode, programListOverviewType){
    this.nameForTabLabel = "ProgramList"
    this.programListNode = programListNode
    
    // The specifics of this program list
    var programListType = programListOverviewType
    
    
    var sectionsContainer = document.createElement("div")
    sectionsContainer.className = "fillSpace columnFlex ProgramListOverviewSectionsContainer"

    // Make an instance of NodeCombos to include html elements
    var interface = new NodeCombos(sectionsContainer)
    
    // Weak map to keep references to section nodes
    var programSections = new WeakMap();

    function addInterface(){

        // Make sections of the exploit list overview panel (list section and panel options)
        var sections = ["programListCollapsibles", "programListOptions"]
        interface.addMultipleSections(sections)

        // ==== Populate the group ====
        interface.selectNode(interface.getNode("programListCollapsibles"))
        interface.getNode("programListCollapsibles").style = "overflow-y:scroll; overflow-x:hidden"
        interface.getNode("programListCollapsibles").className = "stretchFlex programListCollapsibles bg-light"

        // Create a form to put all of the components in
        var formNode = document.createElement("form")
        //formNode.style ="background-color:red"
        formNode.className = "programListCollapsiblesForm"
        formNode.setAttribute("onSubmit", "return false")

        // Add a reference to formNode on node combos, and append it
        interface.addReferenceToNode(formNode.className, formNode)
        interface.getNode("programListCollapsibles").appendChild(formNode)
    }
    addInterface()

    // Define the function that adds progran sections
    this.addProgramSection = function(programName, program){
        //Select the area for the groups
        interface.selectNode(interface.getNode("programListCollapsiblesForm"))
        
        var group = interface.addCollapsibleGroup(null, programName, programListType.iconLigature)
        // General details of exploit
        interface.addLabelPair(null, "Name: ", "programName", programName)
        interface.addLabelPair(null, "OS(s): ", "programOs", program.getOs())
        interface.addLabelPair(null, "Target Program: ", "programTarget", program.getDescription())

        //interface.addSingleButton("Delete Exploit", "col ml-1 mr-1 mt-2 btn btn-danger", function(){showToast("DeleteOnServer", "delete exploit from server was clicked")})
        var addProgram = function(){
            
        }
        interface.addDeleteAndIncludeButtons(null, function(){showToast("EditExploitOnServer", "editExploit on server was clicked")}, null, addProgram)

        // keep reference to group node in map
        programSections.set(program, group)
        
        // Select form again
        interface.selectNode(interface.getNode("programListCollapsiblesForm"))
        
        return group
    }
    
    // Create the groups for the available programs by calling addProgramSection()
    var programs = widow.programs[programListType.origin]()
    for (programName in programs){
        this.addProgramSection(programName, programs[programName])
    }


    // section at bottom of overview column
    interface.selectNode(interface.getNode("programListOptions"))
    interface.getNode("programListOptions").className = "fixedFlex container programListOptions bg-dark"

    //var optionButtons = {"Add Exploit_primary":null}
    //interface.addOverviewOptionsButtons(optionButtons)
    interface.addSingleButton(programListType.uploadButtonLabel, "col mt-2 mb-2 btn btn-primary", function(){openWindow('./screens/windows/dialogs/upload/upload.html', 530, 355, false, true)})

    this.programListNode.appendChild(sectionsContainer)
    
    


    this.setExploits = function(exploit){
        for(var i = 0; i < exploit.length; i++){
            this.getNode("exploitName").innerHTML = exploit[i].getName()
            this.getNode("exploitOs").innerHTML = exploits[i].getOs()

        }
    }
    
    this.programsModified = function(target, modificationType, arg){
        switch(modificationType){
            case modificationTypes.ADDED_ELEMENT:
                if (!arg.getIsExploit()){
                    var group = this.addProgramSection(arg.name, arg)
                    $(group.lastChild).collapse('show')
                }
                break;
        }
    }.bind(this)
    onModified(widow.programs, this.programsModified)
}