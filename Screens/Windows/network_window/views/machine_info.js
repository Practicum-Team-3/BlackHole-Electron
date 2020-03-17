function MachineInfo(machineInfoNode){
    
    var formNode = document.createElement("form")
    formNode.setAttribute("onSubmit", "return false")
    
    var interface = new NodeCombos(formNode)
    
    addInterfaceNodes()
    
    // Generates the interface 
    function addInterfaceNodes(){
    
        //GENERATE INTERFACE
        addNode(formNode, "div", "bigIcon", "desktop")

        interface.addLabelPair(null, "Name:", "machineName", "")
        interface.addLabelPair(null, "OS:", "machineOs", "")
        interface.addLabelPair(null, "Type:", "machineType", "")
        interface.addLabelPair(null, "GUI:", "machineGui", "")
        interface.addEditDeleteButtons(null, function(){showToast("Edit", "Edit was clicked")}, null, function(){showToast("Delete", "Delete was clicked")})
        addBrNode(formNode)

        // === Network
        interface.addCollapsibleGroup("Network", "network-wired")

        interface.addLabelAndInput(null, "Network:", "networkValue", "")
        interface.addLabelAndInput(null, "IP:", "ipValue", "")

        // === Collector
        interface.deselectNode()
        interface.addCollapsibleGroup("Collector", "inbox")

        interface.addLabelAndSelect(null, "Collector:", "collectorValue", ["ECELd"])

        interface.addCheckbox("networkTraffic", "Network Traffic")
        interface.addCheckbox("systemLogs", "System Logs")
        interface.addCheckbox("apiCalls", "API Calls")

        interface.addLabelAndSelect(null, "Start:", "startCondition", ["Total Eclipse"])
        interface.addLabelAndSelect(null, "Stop:", "stopCondition", ["Earthquake"])
        interface.addCheckbox("timeout", "Timeout")

        // === Program
        interface.deselectNode()
        interface.addCollapsibleGroup("Program", "code")

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
 * @param {object} centralView [[Description]]
 */
MachineInfo.prototype.setMachine = function(machine){
    this.getNode("machineName").innerHTML = machine.getName()
    this.getNode("machineOs").innerHTML = machine.getOs()
    this.getNode("machineType").innerHTML = machine.getIsAttacker() ? "Attacker" : "Victim"
    this.getNode("machineGui").innerHTML = machine.getGui()
}