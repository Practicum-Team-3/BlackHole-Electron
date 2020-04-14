
var machineInfoDefaultWidth = 300
/**
 * @class MachineInfo
 * @description Model for the machine info panel
 * @param   {object} machineInfoNode Node where the machine info components should get added
 */
function MachineInfo(machineInfoNode){
    var self = this
    this.parentNode = machineInfoNode
    this.machine = null
    
    // Create a form to put all of the components in
    var formNode = document.createElement("form")
    formNode.style.width = machineInfoDefaultWidth+"px"
    formNode.setAttribute("onSubmit", "event.preventDefault(); return false")
    
    // Create a NodeCombos instance to add prepackaged components and keep a reference to them
    var interface = new NodeCombos(formNode)
    
    
    this.getInterface = function(){
        return interface
    }
    
    this.getNode = function(nodeName){
        return this.getInterface().getNodes()[nodeName]
    }
    
    /**
     * @function update
     * @private
     * @description Fill panel with current machine info
     */
    this.update = function(){
        if (this.machine==null){
            return
        }
        var machine = this.machine
        this.getNode("rename").value = machine.getName()
        console.log(machine.getName())
        this.getNode("os").innerHTML = machine.getOs()
        this.getNode("machineType").innerHTML = machine.getIsAttacker() ? "Attacker" : "Victim"
        this.getNode("machineGui").innerHTML = machine.getGui()
        this.getNode("setBaseMemory").value = machine.getBaseMemory()
        this.getNode("setBaseMemory").dispatchEvent(new Event("input"))
        this.getNode("setProcessors").value = machine.getProcessors()
        this.getNode("setProcessors").dispatchEvent(new Event("input"))
        this.getNode("networkValue").value = ""
    }.bind(this)

    
    /**
     * @function onchange
     * @description Intended for use as a callback for whenever a node combo gets edited
     * @param {string} nodeName Name of the node element that got edited
     * @param {object} node     Reference to node that got edited
     * @param {Any} Preprocessed value of the changed element
     */
    this.onchange = function(nodeName, node, value){
        this.machine[nodeName](node.value)
    }.bind(this)
    
    addInterfaceNodes()
    
    // Generates the interface by making calls to NodeCombos (interface)
    function addInterfaceNodes(){
//        var floating = addFloatingButtonNode(formNode, function(){
//            
//        }, "eye-slash")
//        floating.classList.add("pr-5")
        
        // Computer icon
        addNode(formNode, "div", "bigIcon", "desktop")
        
        // Setup change event
        interface.setOnchangeCallback(self.onchange)
        
        // General details
        interface.addLabelAndInput(null, "Name:", "rename", "")
        addBrNode(formNode)
        interface.addLabelPair(null, "OS:", "os", "")
        interface.addLabelPair(null, "Type:", "machineType", "")
        interface.addLabelPair(null, "GUI:", "machineGui", "")
        //missing handlers that modify scenario object and then call 'netGraph.onScenarioChanged(modifiedScenario)' 
        interface.addEditDeleteButtons("editMachineButton", function(){showToast("Edit Machine", "Not yet implemented")}, "deleteMachineButton", function(){showToast("Delete Machine", "Not yet implemented")})
        addBrNode(formNode)

        // === Settings
        interface.addCollapsibleGroup(null, "Settings", "tools", null, true)
        
        interface.addLabel(null, "CPUs:")
        interface.addRangeAndValue("setProcessors", 1, 16, 1, 2)
        interface.addLabel(null, "Base Memory (MB):")
        interface.addRangeAndValue("setBaseMemory", 512, 8192, 1, 2048)

        
        // === Network
        // Create group, then add components into it
        interface.deselectNode()
        interface.addCollapsibleGroup(null, "Network", "network-wired", null, true)

        interface.addLabelAndInput(null, "Network:", "networkValue", "")
        interface.addLabelPair(null, "IP:", "ipValue", "")
        
        
        // === Collector
        // Exit previous group, create new group, then add components into it
        interface.deselectNode()
        interface.addCollapsibleGroup(null, "Collectors", "inbox", null, true)

        interface.addLabelAndSelect(null, "Collector:", "collectorValue", ["ECELd"])

        interface.addCheckbox("networkTraffic", "Network Traffic")
        interface.addCheckbox("systemLogs", "System Logs")
        interface.addCheckbox("apiCalls", "API Calls")

        interface.addLabelAndSelect(null, "Start:", "startCondition", ["Total Eclipse", "Pandemic"])
        interface.addLabelAndSelect(null, "Stop:", "stopCondition", ["Earthquake"])
        interface.addCheckbox("timeout", "Timeout")

        // === Program
        // Exit previous group, create new group, then add components into it
        interface.deselectNode()
        interface.addCollapsibleGroup(null, "Programs", "code", null, true)

        interface.addLabelAndSelect(null, "Program:", "program", [""])
        interface.addLabelAndInput(null, "Path:", "path", "")
        interface.addLabelAndInput(null, "Start Time:", "startTime", "12")
        
        //interface.addVerticalList(null, ["sh", "rox"], function(event){console.log(event)}, function(event){event.stopPropagation()}, "cog")

        machineInfoNode.appendChild(formNode)
    }
}


/**
 * @function setMachine
 * @description Assign a machine to the info panel for editing
 * @param {Machine} machine Machine object to use
 */
MachineInfo.prototype.setMachine = function(machine){
    this.clear()
    this.machine = machine
    onModified(this.machine, this.update)
    this.parentNode.style.width = machineInfoDefaultWidth+"px"
    this.update()
}

/**
 * @function clear
 * @description Call to unassign the machine from the machine info
 */
MachineInfo.prototype.clear = function(){
    if (this.machine==null){
        return
    }
    removeOnModifiedListener(this.machine, this.update)
    this.parentNode.style.width = ""
    this.machine = null
}
