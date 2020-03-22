/**
 * @class ProgramOverview
 * @description Program List in the overview panel
 */
function ProgramListOverview(programListNode){
    
    this.nameForTabLabel = "ProgramList"
    this.programListNode = programListNode

    var sectionsContainer = document.createElement("div")
    sectionsContainer.className = "ProgramListOverviewSectionsContainer"
    sectionsContainer.style = "height:92%;"

    // Make an instance of NodeCombos to include html elements
    var interface = new NodeCombos(sectionsContainer)

    // Make sections of the program list overview panel
    var sections = ["programListCollapsibles", "programListOptions"]
    interface.addMultipleSections(sections)

    // Populate the collapsibles
    interface.selectNode(interface.getNodes()["programListCollapsibles"])
    interface.getNodes()["programListCollapsibles"].style = "height:85%; overflow-y:scroll; overflow-x:hidden; margin-bottom:2px;"
    interface.getNodes()["programListCollapsibles"].className = "programListCollapsibles bg-light"

    // Create a form to put all of the components in
    var formNode = document.createElement("form")
    //formNode.style ="background-color:red"
    formNode.className = "programListCollapsiblesForm"
    formNode.setAttribute("onSubmit", "return false")

    // Add a reference to formNode and append it
    interface.addReferenceToNode(formNode.className, formNode)
    interface.getNodes()["programListCollapsibles"].appendChild(formNode)

    // Select or point to form node to work on
    interface.selectNode(interface.getNodes()["programListCollapsiblesForm"])

    // Populate the form
    for (var i = 0; i < 5; i++){
        interface.addCollapsibleGroup("Program " + (i+1), "server")
        // General details of program
        interface.addLabelPair(null, "Name: ", "programName", "")
        interface.addLabelPair(null, "OS(s): ", "programOs", "")
        interface.addLabelPair(null, "Vulnerability: ", "programVuln", "")

        //interface.addSingleButton("Delete Program", "col ml-1 mr-1 mt-2 btn btn-danger", function(){showToast("DeleteOnServer", "delete program from server was clicked")})
        interface.addEditDeleteButtons(null, function(){showToast("EditProgOnServer", "edit on server was clicked")}, null, function(){showToast("DeleteProgOnServer", "DeleteProgram was clicked")})

        // Select form again
        interface.selectNode(interface.getNodes()["programListCollapsiblesForm"])
    }


    // section at bottom of overview column
    interface.selectNode(interface.getNodes()["programListOptions"])
    interface.getNodes()["programListOptions"].style = "height:15%;"
    interface.getNodes()["programListOptions"].className = "container programListOptions bg-dark"

    //var optionButtons = {"Add Program_primary":null}
    //interface.addOverviewOptionsButtons(optionButtons)
    interface.addSingleButton("Upload Program", "col ml-1 mr-1 mt-2 btn btn-primary", function(){showToast("uploadProgram", "updload program to server was clicked")})

    this.programListNode.appendChild(sectionsContainer)

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
        this.programListNode = element
    }

    this.setPrograms = function(programs){
        for(var i = 0; i < programs.length; i++){
            this.getNode("programName").innerHTML = programs[i].getName()
            this.getNode("programOs").innerHTML = programs[i].getOs()

        }
    }
}