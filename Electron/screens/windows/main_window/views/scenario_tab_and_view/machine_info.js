
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
        this.getNode("setIsAttacker-getIsAttacker").selectedIndex = machine.getIsAttacker() ? 1 : 0
        this.getNode("machineGui").innerHTML = machine.getGui()
        this.getNode("setBaseMemory-getBaseMemory").value = machine.getBaseMemory()
        this.getNode("setBaseMemory-getBaseMemory").dispatchEvent(new Event("input"))
        this.getNode("setProcessors-getProcessors").value = machine.getProcessors()
        this.getNode("setProcessors-getProcessors").dispatchEvent(new Event("input"))
        this.getNode("networkValue").value = ""
        this.getNode("setIpAddress-getIpAddress").innerHTML = machine.networkSettings.getIpAddress()

    }.bind(this)
    
    this.updatePrograms = function(){
        if (this.machine==null){
            return
        }
        var machine = this.machine
        
        var installedProgramsList = interface.getNode("installedPrograms")
        
        // Clear group
        installedProgramsList.innerHTML = ""
        
        // Add elements back
        
        var editClicked = function(event){
            editInstalledProgram(machine, event.target.label)
        }
        
        var trashcanClicked = function(event){
            event.stopPropagation()
            // Get the program
            var programToRemove = machine.programs.getProgramsByName(event.target.parentNode.label)[0]
            if (programToRemove!=null){
                
                machine.programs.removeProgram(programToRemove)
                event.target.parentNode.remove()
            }
        }
        
        interface.addItemsToVerticalList(installedProgramsList, machine.programs.getProgramNamesList(), editClicked, trashcanClicked, "trash")
    }.bind(this)

    
    /**
     * @function onchange
     * @description Intended for use as a callback for whenever a node combo gets edited
     * @param {string} nodeName Name of the node element that got edited
     * @param {object} node     Reference to node that got edited
     * @param {Any} Preprocessed value of the changed element
     */
    this.onchange = function(nodeName, node, value){
        //console.log("onChange was called...")
        if (this.machine==null){
            return
        }
        
        //Adjust value for special cases
        switch(nodeName){
            case "setIsAttacker-getIsAttacker":
                value = value == "Attacker"
            break
        }
        
        // Get setter and getter from nodeName ('cause that's how they're named on here)
        var setterAndGetter = nodeName.split("-")
        if (setterAndGetter.length==2){// Quick sanity check
            
            var setter = setterAndGetter[0]
            var getter = setterAndGetter[1]

            //Set new value on machine
            this.machine[setter](value)

            // Tell everyone about it
            emitModifiedEvent(this.machine, this.machineModified, modificationTypes.EDITED, getter)
            
        }
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
        
        interface.addLabelPair(null, "Box:", "box", "")
        interface.addEditDeleteButtons("editMachineButton", function(){showToast("Edit Machine", "Not yet implemented")}, "deleteMachineButton", function(){showToast("Delete Clicked", "Not yet implemented")})
        
        addBrNode(formNode)
        
        // === General
        interface.addCollapsibleGroup(null, "General", "cog", null, true)
        
        // General details
        interface.addLabelAndInput(null, "Name:", "setName-getName", "")
        //addBrNode(formNode)
        //interface.addLabelPair(null, "Type:", "machineType", "")
        interface.addLabelAndSelect(null, "Type:", "setIsAttacker-getIsAttacker", ["Victim", "Attacker"])
        interface.addLabelPair(null, "GUI:", "machineGui", "")
        

        // === Settings
        interface.deselectNode()
        interface.addCollapsibleGroup(null, "Settings", "sliders-h", null, true)
        
        interface.addLabel(null, "CPUs:")
        interface.addRangeAndValue("setProcessors-getProcessors", 1, 16, 1, 2)
        interface.addLabel(null, "Base Memory (MB):")
        interface.addRangeAndValue("setBaseMemory-getBaseMemory", 512, 8192, 1, 2048)

        
        // === Network
        // Create group, then add components into it
        interface.deselectNode()
        interface.addCollapsibleGroup(null, "Network", "network-wired", null, true)

        interface.addLabelAndInput(null, "Network:", "networkValue", "")
        interface.addLabelPairLeft(null, "IP:", "setIpAddress-getIpAddress", "")

        // === Program
        // Exit previous group, create new group, then add components into it
        interface.deselectNode()
        interface.addCollapsibleGroup(null, "Programs", "file-code", null, true)

        interface.addVerticalList("installedPrograms", [], null, null, "")
        
        
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

        machineInfoNode.appendChild(formNode)
    }
}

MachineInfo.prototype.deleteMachine = function(){
    try{
        getActiveScenarioTab().getScenario().machines.removeMachineByName(this.machine.getName())
    }catch(error){
        console.log(error)
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
