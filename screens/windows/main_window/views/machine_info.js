
/**
 * @class MachineInfo
 * @description Model for the machine info panel
 * @param   {object} machineInfoNode Node where the machine info components should get added
 */
function MachineInfo(machineInfoNode){
    var self = this
    this.machine = null
    
    // Create a form to put all of the components in
    var formNode = document.createElement("form")
    formNode.setAttribute("onSubmit", "return false")
    
    // Create a NodeCombos instance to add prepackaged components and keep a reference to them
    var interface = new NodeCombos(formNode)
    
    addInterfaceNodes()
    
    // Generates the interface by making calls to NodeCombos (interface)
    function addInterfaceNodes(){
    
        // Computer icon
        addNode(formNode, "div", "bigIcon", "desktop")
        
        // Setup change event
        interface.setOnchangeCallback(self.onchange)
        
        // General details
        interface.addLabelPair(null, "Name:", "name", "")
        interface.addLabelPair(null, "OS:", "os", "")
        interface.addLabelPair(null, "Type:", "machineType", "")
        interface.addLabelPair(null, "GUI:", "machineGui", "")
        //missing handlers that modify scenario object and then call 'netGraph.onScenarioChanged(modifiedScenario)' 
        interface.addEditDeleteButtons("editMachineButton", function(){showToast("Edit Machine", "Not yet implemented")}, "deleteMachineButton", function(){showToast("Delete Machine", "Not yet implemented")})
        addBrNode(formNode)

        // === Network
        // Create group, then add components into it
        interface.addCollapsibleGroup("Network", "network-wired")

        interface.addLabelAndInput(null, "Network:", "networkValue", "")
        interface.addLabelAndInput(null, "IP:", "ipValue", "")

        // === Collector
        // Exit previous group, create new group, then add components into it
        interface.deselectNode()
        interface.addCollapsibleGroup("Collectors", "inbox")

        interface.addLabelAndSelect(null, "Collector:", "collectorValue", ["ECELd"])

        interface.addCheckbox("networkTraffic", "Network Traffic")
        interface.addCheckbox("systemLogs", "System Logs")
        interface.addCheckbox("apiCalls", "API Calls")

        interface.addLabelAndSelect(null, "Start:", "startCondition", ["Total Eclipse"])
        interface.addLabelAndSelect(null, "Stop:", "stopCondition", ["Earthquake"])
        interface.addCheckbox("timeout", "Timeout")

        // === Program
        // Exit previous group, create new group, then add components into it
        interface.deselectNode()
        interface.addCollapsibleGroup("Programs", "code")

        interface.addLabelAndSelect(null, "Program:", "program", [""])
        interface.addLabelAndInput(null, "Path:", "path", "")
        interface.addLabelAndInput(null, "Start Time:", "startTime", "12")

        machineInfoNode.appendChild(formNode)
    }
    
    this.getInterface = function(){
        return interface
    }
    
    this.getNode = function(nodeName){
        return this.getInterface().getNodes()[nodeName]
    }
}


/**
 * @function setMachine
 * @description Take the information of a machine and fill the machine info section with it
 * @param {Machine} machine Machine object to use
 */
MachineInfo.prototype.setMachine = function(machine){
    this.clear()
    this.machine = machine
    this.machine.onModified(this.update.bind(this))
    this.update()
}

/**
 * @function clear
 * @description Call to unassign the scenario from the machine info
 */
MachineInfo.prototype.clear = function(){
    if (this.machine==null){
        return
    }
    this.machine.removeOnModifiedListener(this.update)
    this.machine = null
}

MachineInfo.prototype.update = function(){
    if (this.machine==null){
        return
    }
    var machine = this.machine
    this.getNode("name").innerHTML = machine.getName()
    this.getNode("os").innerHTML = machine.getOs()
    this.getNode("machineType").innerHTML = machine.getIsAttacker() ? "Attacker" : "Victim"
    this.getNode("machineGui").innerHTML = machine.getGui()
    this.getNode("networkValue").value = ""
}

MachineInfo.prototype.onchange = function(nodeName, node){
    console.log(nodeName)
}
