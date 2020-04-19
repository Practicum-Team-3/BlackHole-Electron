const programListOverviewTypes = {
    VULNERABILITIES: {
        origin: "getAllNonExploits",
        shouldBeExploit: false,
        iconLigature: "bug",
        uploadButtonLabel: "Upload Program",
        uploadArgument: "--vulnerability-upload"
    },
    EXPLOITS: {
        origin: "getAllExploits",
        shouldBeExploit: true,
        iconLigature: "bomb",
        uploadButtonLabel: "Upload Exploit",
        uploadArgument: "--exploit-upload"
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
    
    this.onDeleteButtonClick = function(programToDelete, event){
        event.target.disabled = true
        
        widow.programs.removeProgram(programToDelete)
        .then(function(){
            emitModifiedEvent(widow.programs, null, modificationTypes.REMOVED_ELEMENT, programToDelete)
        }.bind(this)).catch(function(){
            event.target.disabled = false
        })
    }
    
    this.onIncludeButtonClick = function(programToInclude, event){
        var scenarioTab = getActiveScenarioTab()
        var selectedMachine
        if (scenarioTab!=null){
            selectedMachine = scenarioTab.getSelectedMachine()
            if (selectedMachine!=null){
                var didAddProgram = selectedMachine.programs.addProgram(programToInclude.getName(), "/bin")
                if (didAddProgram){
                    // Tell the world about this
                    emitModifiedEvent(selectedMachine, null, modificationTypes.EDITED, "programs")
                }
            }
        }
    }

    // Define the function that adds progran sections
    this.addProgramSection = function(programName, program){
        //Select the area for the groups
        interface.selectNode(interface.getNode("programListCollapsiblesForm"))
        
        var group = interface.addCollapsibleGroup(null, programName, programListType.iconLigature)
        // General details of exploit
        interface.addLabelPair(null, "Name: ", "programName", programName)
        interface.addLabelPair(null, "OS: ", "programOs", program.getOs())
        interface.addLabelPair(null, "Description: ", "programTarget", program.getDescription())
        
        interface.addDeleteAndIncludeButtons(null, this.onDeleteButtonClick.bind(this, program), null, this.onIncludeButtonClick.bind(this, program))

        // keep reference to group node in map
        programSections.set(program, group)
        
        // Select form again
        interface.selectNode(interface.getNode("programListCollapsiblesForm"))
        
        return group
    }.bind(this)
    
    this.removeProgramSection = function(program){
        programSections.get(program).remove()
        programSections.delete(program)
    }.bind(this)
    
    // Create the groups for the available programs by calling addProgramSection()
    var programs = widow.programs[programListType.origin]()
    programs.forEach(function(program){
        
        this.addProgramSection(program.getName(), program)
        
    }.bind(this))
    

    //=====================================
    // Section at bottom of overview column
    
    interface.selectNode(interface.getNode("programListOptions"))
    interface.getNode("programListOptions").className = "fixedFlex container programListOptions bg-dark"

    //var optionButtons = {"Add Exploit_primary":null}
    //interface.addOverviewOptionsButtons(optionButtons)
    interface.addSingleButton(programListType.uploadButtonLabel, "col mt-2 mb-2 btn btn-primary", function(){openWindow('./screens/windows/dialogs/upload/upload_program.html', 530, 455, false, true, false, [programListType.uploadArgument])})

    //==============
    // FINAL APPEND
    this.programListNode.appendChild(sectionsContainer)
    
    


    this.setExploits = function(exploit){
        for(var i = 0; i < exploit.length; i++){
            this.getNode("exploitName").innerHTML = exploit[i].getName()
            this.getNode("exploitOs").innerHTML = exploits[i].getOs()

        }
    }
    
    this.programsModified = function(target, modificationType, arg){
        
        switch(modificationType){
            // Added Program
            case modificationTypes.ADDED_ELEMENT:
                
                if (arg.getIsExploit()==programListType.shouldBeExploit){
                    var group = this.addProgramSection(arg.getName(), arg)
                    $(group.lastChild).collapse('show')
                }
                break;
            case modificationTypes.REMOVED_ELEMENT:
                
                if (arg.getIsExploit()==programListType.shouldBeExploit){
                    this.removeProgramSection(arg)
                }
                break;
        }
    }.bind(this)
    onModified(widow.programs, this.programsModified)
}