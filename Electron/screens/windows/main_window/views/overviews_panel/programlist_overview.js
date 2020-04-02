/**
 * @class ProgramOverview
 * @description Program List in the overview panel
 */
function ProgramListOverview(programListNode){
    
    this.nameForTabLabel = "ExploitList"
    this.exploitListNode = programListNode

    var sectionsContainer = document.createElement("div")
    sectionsContainer.className = "fillSpace columnFlex ExploitListOverviewSectionsContainer"

    // Make an instance of NodeCombos to include html elements
    var interface = new NodeCombos(sectionsContainer)

    // Make sections of the exploit list overview panel
    var sections = ["exploitListCollapsibles", "exploitListOptions"]
    interface.addMultipleSections(sections)

    // Populate the collapsibles
    interface.selectNode(interface.getNodes()["exploitListCollapsibles"])
    interface.getNodes()["exploitListCollapsibles"].style = "overflow-y:scroll; overflow-x:hidden"
    interface.getNodes()["exploitListCollapsibles"].className = "stretchFlex exploitListCollapsibles bg-light"

    // Create a form to put all of the components in
    var formNode = document.createElement("form")
    //formNode.style ="background-color:red"
    formNode.className = "exploitListCollapsiblesForm"
    formNode.setAttribute("onSubmit", "return false")

    // Add a reference to formNode and append it
    interface.addReferenceToNode(formNode.className, formNode)
    interface.getNodes()["exploitListCollapsibles"].appendChild(formNode)

    // Select or point to form node to work on
    interface.selectNode(interface.getNodes()["exploitListCollapsiblesForm"])

    this.addExploitSection = function(exploitName, exploit){
        interface.selectNode(interface.getNode("exploitListCollapsiblesForm"))
        
        var group = interface.addCollapsibleGroup(null, exploitName, "bomb")
        // General details of exploit
        interface.addLabelPair(null, "Name: ", "exploitName", exploitName)
        interface.addLabelPair(null, "OS(s): ", "exploitOs", exploit.getOs())
        interface.addLabelPair(null, "Target Program: ", "exploitTarget", exploit.getDescription())

        //interface.addSingleButton("Delete Exploit", "col ml-1 mr-1 mt-2 btn btn-danger", function(){showToast("DeleteOnServer", "delete exploit from server was clicked")})
        var addExploit = function(){
            
        }
        interface.addDeleteAndIncludeButtons(null, function(){showToast("EditExploitOnServer", "editExploit on server was clicked")}, null, addExploit)

        // Select form again
        interface.selectNode(interface.getNode("exploitListCollapsiblesForm"))
        
        return group
    }
    
    // Populate the form
    var exploits = widow.programs.getAllNonExploits()
    for (exploitName in exploits){
        this.addExploitSection(exploitName, exploits[exploitName])
    }


    // section at bottom of overview column
    interface.selectNode(interface.getNodes()["exploitListOptions"])
    interface.getNodes()["exploitListOptions"].className = " fixedFlex container exploitListOptions bg-dark"

    //var optionButtons = {"Add Exploit_primary":null}
    //interface.addOverviewOptionsButtons(optionButtons)
    interface.addSingleButton("Upload Program", "col mt-2 mb-2 btn btn-primary", function(){openWindow('./screens/windows/dialogs/upload/upload.html', 530, 355, false, true)})

    this.exploitListNode.appendChild(sectionsContainer)
    
    

    //----------------------------------------

    this.getInterface = function(){
        return interface
    }

    this.getNode = function(nodeName){
        return this.getIntercace().getNodes()[nodeName]
    }

    this.getTabLabel = function(){
        return this.nameForTabLabel
    }

    this.setNode = function(element){
        this.exploitListNode = element
    }

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
                    var group = this.addExploitSection(arg.name, arg)
                    $(group.lastChild).collapse('show')
                }
                break;
        }
    }.bind(this)
    onModified(widow.programs, this.programsModified)
}