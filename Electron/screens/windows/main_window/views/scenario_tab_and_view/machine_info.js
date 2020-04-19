
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
    
    this.machineModified = function(target, modificationType, arg){
        switch(modificationType){
            // EDIT
            case modificationTypes.EDITED:
                // Special modification cases
                switch (arg){
                    // Installed programs changed
                    case "programs":
                        this.updatePrograms()
                    break
                    //General update
                    default:
                        this.updateFields()
                    break
                }
            break;
            case modificationTypes.DESTROYED:
                
            break;
        }
        
    }.bind(this)
    
    /**
     * @function updateFields
     * @private
     * @description Fill panel fields with current machine info
     */
    this.updateFields = function(){
        
        if (this.machine==null){
            return
        }
        var machine = this.machine
        this.getNode("setName-getName").value = machine.getName()
        
        this.getNode("box").innerHTML = machine.getBox()
        this.getNode("machineType").innerHTML = machine.getIsAttacker() ? "Attacker" : "Victim"
        this.getNode("machineGui").innerHTML = machine.getGui()
        this.getNode("setBaseMemory-getBaseMemory").value = machine.getBaseMemory()
        this.getNode("setBaseMemory-getBaseMemory").dispatchEvent(new Event("input"))
        this.getNode("setProcessors-getProcessors").value = machine.getProcessors()
        this.getNode("setProcessors-getProcessors").dispatchEvent(new Event("input"))
        this.getNode("networkValue").value = ""

    }.bind(this)
    
    this.updatePrograms = function(){
        if (this.machine==null){
            return
        }
        var machine = this.machine
        // Clear group
        
        // Add elements back
        var installedProgramsGroup = interface.getNode("installedPrograms")
        interface.addItemsToVerticalList(installedProgramsGroup, machine.programs.getProgramNamesList(), function(event){console.log(event)}, function(event){event.stopPropagation()}, "trash")
    }.bind(this)

    
    /**
     * @function onchange
     * @description Intended for use as a callback for whenever a node combo gets edited
     * @param {string} nodeName Name of the node element that got edited
     * @param {object} node     Reference to node that got edited
     * @param {Any} Preprocessed value of the changed element
     */
    this.onchange = function(nodeName, node, value){
        if (this.machine==null){
            return
        }
        // Get setter and getter from nodeName ('cause that's how they're named on here)
        var setterAndGetter = nodeName.split("-")
        var setter = setterAndGetter[0]
        var getter = setterAndGetter[1]
        
        this.machine[setter](node.value)
        // Tell everyone about it
        emitModifiedEvent(this.machine, this.machineModified, modificationTypes.EDITED, getter)
    }.bind(this)
    
    this.onDeleteButtonClick = function(){
        
        
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
        interface.addLabelAndInput(null, "Name:", "setName-getName", "")
        addBrNode(formNode)
        interface.addLabelPair(null, "Box:", "box", "")
        interface.addLabelPair(null, "Type:", "machineType", "")
        interface.addLabelPair(null, "GUI:", "machineGui", "")
        //missing handlers that modify scenario object and then call 'netGraph.onScenarioChanged(modifiedScenario)' 
        interface.addEditDeleteButtons("editMachineButton", function(){showToast("Edit Machine", "Not yet implemented")}, "deleteMachineButton", function(){showToast("Delete Machine", "Not yet implemented")})
        addBrNode(formNode)

        // === Settings
        interface.addCollapsibleGroup(null, "Settings", "tools", null, true)
        
        interface.addLabel(null, "CPUs:")
        interface.addRangeAndValue("setProcessors-getProcessors", 1, 16, 1, 2)
        interface.addLabel(null, "Base Memory (MB):")
        interface.addRangeAndValue("setBaseMemory-getBaseMemory", 512, 8192, 1, 2048)

        
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

        interface.addVerticalList("installedPrograms", [], null, null, "")

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
    onModified(this.machine, this.machineModified)
    this.parentNode.style.width = machineInfoDefaultWidth+"px"
    this.updateFields()
    this.updatePrograms()
}

/**
 * @function getAssignedMachine
 * @description Returns the machine that was assigned to the panel
 * @returns {Machine} Assigned machine
 */
MachineInfo.prototype.getAssignedMachine = function(){
    return this.machine
}

/**
 * @function clear
 * @description Call to unassign the machine from the machine info
 */
MachineInfo.prototype.clear = function(){
    if (this.machine==null){
        return
    }
    removeOnModifiedListener(this.machine, this.machineModified)
    this.parentNode.style.width = ""
    this.machine = null
}
