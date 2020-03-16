function MachineInfo(scenario, machineInfoNode){
    this.scenario = scenario
    
    var formNode = document.createElement("form")
    formNode.setAttribute("onSubmit", "return false")
    
    var interface = new NodeCombos(formNode)
    
    addInterfaceNodes()
    
    // Generates the interface 
    function addInterfaceNodes(){
    
        //GENERATE INTERFACE
        addLabelNode(formNode, "bigIcon", "desktop")

        interface.addLabelPair(null, "Name:", "nameValue", "UNDEF")
        interface.addLabelPair(null, "OS:", "osValue", "UNDEF")
        interface.addLabelPair(null, "Vulnerability:", "vulnerabilityValue", "UNDEF")
        interface.addLabelPair(null, "GUI:", "guiValue", "UNDEF")
        interface.addEditDeleteButtons()

        addBrNode(formNode)

        // === Network
        interface.addCollapsibleGroup("Network")

        interface.addLabelAndInput(null, "Network:", "networkValue", "")
        interface.addLabelAndInput(null, "IP:", "ipValue", "")

        // === Collector
        interface.deselectNode()
        interface.addCollapsibleGroup("Collector")

        interface.addLabelAndSelect(null, "Collector:", "collectorValue", ["ECELd"])

        interface.addCheckbox("networkTraffic", "Network Traffic")
        interface.addCheckbox("systemLogs", "System Logs")
        interface.addCheckbox("apiCalls", "API Calls")

        interface.addLabelAndSelect(null, "Start:", "startCondition", ["Total Eclipse"])
        interface.addLabelAndSelect(null, "Stop:", "stopCondition", ["Earthquake"])
        interface.addCheckbox("timeout", "Timeout")

        // === Program
        interface.deselectNode()
        interface.addCollapsibleGroup("Program")

        interface.addLabelAndSelect(null, "Program:", "program", [""])
        interface.addLabelAndInput(null, "Path:", "path", "")
        interface.addLabelAndInput(null, "Start Time:", "startTime", "12")

        machineInfoNode.appendChild(formNode)
    }
}


/**
 * @function fillMachineInfo
 * @description Take the information of a machine and fill the machine info section with it
 * @param {object} centralView [[Description]]
 */
MachineInfo.prototype.updateFields = function(){
//    centralView.machineInfo.domElements["nameValue"].innerHTML = machine.getName()
//    centralView.machineInfo.domElements["osValue"].innerHTML = machine.getOs()
//    centralView.machineInfo.domElements["vulnerabilityValue"].innerHTML = "Undefined"
//    centralView.machineInfo.domElements["guiValue"].innerHTML = machine.getGui()
//
//    centralView.machineInfo.domElements["ipValue"].value = machine.networkSettings.getIpAddress()
//    centralView.machineInfo.domElements["networkValue"].value = machine.networkSettings.getNetworkName()
}