/**
 * @class Overview
 * @description Model for the overview panel
 */
function MachineListOverview(machineListNode){

    this.nameForTabLabel = "MachineList"
    this.machineListNode = machineListNode
    // this.machineListNode.style = ""

    var sectionsContainer = document.createElement("div")
    sectionsContainer.className = "MachineListOverviewSectionsContainer"
    sectionsContainer.style = "height:92%"

    var interface = new NodeCombos(sectionsContainer)

    var sections = ["machineListCollapsibles", "machineListOptions"]
    interface.addMultipleSections(sections)

    //populate the collapsibles
    interface.selectNode(interface.getNodes()["machineListCollapsibles"])
    interface.getNodes()["machineListCollapsibles"].style = "height:80%; overflow-y:scroll; overflow-x:hidden; margin-bottom:2px"
    interface.getNodes()["machineListCollapsibles"].className = "machineListCollapsibles bg-light"

    // Create a form to put all of the components in
    var formNode = document.createElement("form")
    // formNode.style = "background-color:red"
    formNode.className = "machineListCollapsiblesForm"
    formNode.setAttribute("onSubmit", "return false")

    interface.addReferenceToNode(formNode.className, formNode)
    interface.getNodes()["machineListCollapsibles"].appendChild(formNode)

    interface.selectNode(interface.getNodes()["machineListCollapsiblesForm"])
    
    //populate the form
    for(var i = 0;i<10;i++){
        interface.addCollapsibleGroup("Machine " + (i+1), "server")
        // General details
        interface.addLabelPair(null, "Name:", "machineName", "skjdh</br>fgsaj</br>dfkaj</br>shdfgk</br>sjdhf</br>ggfdhgf")
        interface.addLabelPair(null, "OS:", "machineOs", "")
        interface.addLabelPair(null, "Exploits:", "machineInstalledExploits", "")
        interface.addLabelPair(null, "Programs:", "machineInstalledPrograms", "")
        interface.addDeleteAndIncludeButtons(null, function(){showToast("DeleteOnServer", "delete from server was clicked")}, null, function(){showToast("AddVM", "Add VM was clicked")})
        interface.selectNode(interface.getNodes()["machineListCollapsiblesForm"])
    }

    interface.selectNode(interface.getNodes()["machineListOptions"])
    interface.getNodes()["machineListOptions"].style = "height:20%;"
    interface.getNodes()["machineListOptions"].className = "container machineListOptions bg-dark"

    var optionButtons = {"Create Machine_primary":null, "Upload Machine_info":null}
    interface.addOverviewOptionsButtons(optionButtons)
    
    this.machineListNode.appendChild(sectionsContainer)


    //-------------------------------------------

    this.getInterface = function(){
        return interface
    }
    
    this.getNode = function(nodeName){
        return this.getInterface().getNodes()[nodeName]
    }

    this.getTabLabel = function(){
        return this.nameForTabLabel
    }

    this.setNode = function(element){
        this.machineListNode = element
    }

    this.setMachines = function(machines){
        for(var i = 0; i<machines.length; i++){
            this.getNode("machineName").innerHTML = machines[i].getName()
            this.getNode("machineOs").innerHTML = machines[i].getOs()
        }
    }
}