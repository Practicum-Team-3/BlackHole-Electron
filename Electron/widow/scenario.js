var Machines = require('./machines.js').Machines
var Modifiable = require('./core/modifiable.js').Modifiable
/**
 * @class Scenario
 * @version 1.5.0
 * @description Modifiable. Single scenario properties
 *              
 * @param {string} descriptor Scenario descriptor (JSON)
 */
function Scenario(descriptor){
    Modifiable.call(this)
    this.descriptor = descriptor
    if (this.descriptor==null){
        this.descriptor = JSON.parse(require('./defaults.js').scenarioDescriptor)
        //Adjustments
        this.setCreationDate(new Date())
        this.setLastAccessed(new Date())
    }
    
    /**
     * @type {ExploitInfo}
     * @description Access exploit info for the scenario
     * @memberof Scenario
     */
    this.exploitInfo = new ExploitInfo(this.descriptor["exploit_info"])
    
    /**
     * @type {VulnerabilityInfo}
     * @description Access vulnerability info for the scenario
     * @memberof Scenario
     */
    this.vulnerabilityInfo = new VulnerabilityInfo(this.descriptor["vulnerability_info"])
    
    /**
     * @type {Machines}
     * @description Access available machines for the scenario
     * @memberof Scenario
     */
    this.machines = new Machines(this.descriptor["machines"])
    
}

/**
 * @function getDescriptorAsString
 * @description Generate and return the updated descriptor (JSON)
 * @memberof Scenario
 * @todo Complete implementation
 *              
 * @returns {string} String representation of the scenario descriptor
 */
Scenario.prototype.getDescriptorAsString = function(){
    
    let stringDescriptor = JSON.stringify(this.descriptor)
    
    //Return
    return stringDescriptor
}

//========================
//=== Setters and getters
//========================
// === NAME
/**
 * @function getName
 * @description Get the name of the scenario
 * @memberof Scenario
 * @returns {string} Name of the scenario
 */
Scenario.prototype.getName = function(){
    return this.descriptor["scenario_name"]
}

/**
 * @function setName
 * @description Set the internal name of a scenario.
 *              When a scenario has been added to the backend, it also has an external name
 *              To set both external and internal names, call renameScenario() on Scenarios instead
 * @memberof Scenario
 * @param {string} ame New name of the scenario
 */
Scenario.prototype.setName = function(name){
    this.descriptor["scenario_name"] = name
}

// === ID
/**
 * @function getId
 * @description Get the ID of the scenario
 * @memberof Scenario
 * @returns {string} ID of the scenario
 */
Scenario.prototype.getId = function(){
    return this.descriptor["scenario_id"]
}

/**
 * @function setId
 * @description Set the ID of the scenario
 * @memberof Scenario
 * @param {string} id New id to set on the scenario
 */
Scenario.prototype.setId = function(id){
    this.descriptor["scenario_id"] = id
}

// === Description

/**
 * @function getDescription
 * @description Returns the scenario description
 * @memberof Scenario
 * @returns {string} Scenario description
 */
Scenario.prototype.getDescription = function(){
    return this.descriptor["description"]
}

/**
 * @function setDescription
 * @description Set the description or summary of the scenario
 * @memberof Scenario
 * @param {string} description Scenario description/summary
 */
Scenario.prototype.setDescription = function(description){
    this.descriptor["description"] = description
}

// === Creation date

/**
 * @function setCreationDate
 * @description Set the creation date of the scenario
 * @memberof Scenario
 * @param {Date} date Date object with the creation date
 */
Scenario.prototype.setCreationDate = function(date){
    this.descriptor["creation_date"] = date.toJSON()
}

/**
 * @function getCreationDate
 * @description Returns the creation date of the scenario in a Date object
 * @memberof Scenario
 * @returns {Date} Creation date of the scenario
 */
Scenario.prototype.getCreationDate = function(){
    return new Date(this.descriptor["creation_date"])
}

// === Last accessed

/**
 * @function setLastAccessed
 * @description Set the last accessed date of the scenario
 * @memberof Scenario
 * @param {Date} date Date object with the last accessed date
 */
Scenario.prototype.setLastAccessed = function(date){
    this.descriptor["last_accessed"] = date.toJSON()
}

/**
 * @function getLastAccessed
 * @description Returns the last accessed date of the scenario in a Date object
 * @memberof Scenario
 * @returns {Date} Last accessed date of the scenario
 */
Scenario.prototype.getLastAccessed = function(){
    return new Date(this.descriptor["last_accessed"])
}

//========================
//=== Exploit Info
//========================
/**
 * @class ExploitInfo
 * @version 1.0.0
 * @param {Object} descriptor Exploit info descriptor object
 */
function ExploitInfo(descriptor){
    this.descriptor = descriptor
}

// === Name
/**
 * @function getName
 * @memberof ExploitInfo
 * @returns {string}
 */
ExploitInfo.prototype.getName = function(){
    return this.descriptor["name"]
}

/**
 * @function setName
 * @memberof ExploitInfo
 * @param {string} name New name
 */
ExploitInfo.prototype.setName = function(name){
    this.descriptor["name"] = name
}

// === type
/**
 * @function getType
 * @memberof ExploitInfo
 * @returns {string}
 */
ExploitInfo.prototype.getType = function(){
    return this.descriptor["type"]
}
/**
 * @function setType
 * @memberof ExploitInfo
 * @param {string} exploitType
 */
ExploitInfo.prototype.setType = function(exploitType){
    this.descriptor["type"] = exploitType
}

// === Download link
/**
 * @function getDownloadLink
 * @memberof ExploitInfo
 * @returns {string} Download address
 */
ExploitInfo.prototype.getDownloadLink = function(){
    return this.descriptor["download_link"]
}
/**
 * @function setDownloadLink
 * @memberof ExploitInfo
 * @param {string} downloadLink Download address
 */
ExploitInfo.prototype.setDownloadLink = function(downloadLink){
    this.descriptor["download_link"] = downloadLink
}

//========================
//=== Vulnerability Info
//========================
/**
 * @class VulnerabilityInfo
 * @version 1.0.0
 * @param {Object} descriptor Vulnerability info descriptor object
 */
function VulnerabilityInfo(descriptor){
    this.descriptor = descriptor
}

// === Name
/**
 * @function getName
 * @memberof VulnerabilityInfo
 * @returns {string}
 */
VulnerabilityInfo.prototype.getName = function(){
    return this.descriptor["name"]
}

/**
 * @function setName
 * @memberof VulnerabilityInfo
 * @param {string} name New name
 */
VulnerabilityInfo.prototype.setName = function(name){
    this.descriptor["name"] = name
}

// === type
/**
 * @function getType
 * @memberof VulnerabilityInfo
 * @returns {string}
 */
VulnerabilityInfo.prototype.getType = function(){
    return this.descriptor["type"]
}
/**
 * @function setType
 * @memberof VulnerabilityInfo
 * @param {string} exploitType
 */
VulnerabilityInfo.prototype.setType = function(exploitType){
    this.descriptor["type"] = exploitType
}

// === CVE Link
/**
 * @function getCveLink
 * @memberof VulnerabilityInfo
 * @returns {string}
 */
VulnerabilityInfo.prototype.getCveLink = function(){
    return this.descriptor["cve_link"]
}
/**
 * @function setCveLink
 * @memberof VulnerabilityInfo
 * @param {string}
 */
VulnerabilityInfo.prototype.setCveLink = function(cveLink){
    this.descriptor["cve_link"] = cveLink
}

// === Download link
/**
 * @function getDownloadLink
 * @memberof VulnerabilityInfo
 * @returns {string} Download address
 */
VulnerabilityInfo.prototype.getDownloadLink = function(){
    return this.descriptor["download_link"]
}
/**
 * @function setDownloadLink
 * @memberof VulnerabilityInfo
 * @param {string} downloadLink Download address
 */
VulnerabilityInfo.prototype.setDownloadLink = function(downloadLink){
    this.descriptor["download_link"] = downloadLink
}


//========================
//=== Machines (DEPRECATED)
//========================
/**
 * @function getMachineNamesList
 * @deprecated Access through .machines instead
 * @description Get a list with the names of the available machines
 * @memberof Scenario
 *
 * @return {string[]} Array of strings of machine names
 */
Scenario.prototype.getMachineNamesList = function(){
    return this.machines.getMachineNamesList()
}

/**
 * @function createNewMachine
 * @deprecated Access through .machines instead
 * @description Creates a new default machine instance with default settings,
 *              adds it to the current list of machines and returns it
 * @memberof Scenario
 * @param   {string} machineName Name to give to the new machine
 * @param   {box}    box         Optional: Name of vagrant box to base machine on
 * @returns {Machine} New Machine instance
 */
Scenario.prototype.createNewMachine = function(machineName, box){
    return this.machines.createNewMachine(machineName, box)
}

/**
 * @function renameMachine
 * @deprecated No longer functional
 * @description Renames a machine both externally and internally
 * @memberof Scenario
 * @param {string} oldName Name of the machine to rename
 * @param {string} newName New name to replace the old
 */
Scenario.prototype.renameMachine = function(oldName, newName){
    
}

/**
 * @function getAllAttackerMachines
 * @deprecated Access through .machines instead
 * @description Get a list of all attacker machine objects
 * @memberof Scenario
 * @returns {Machine[]} Array of attacker machines
 */
Scenario.prototype.getAllAttackerMachines = function(){
    return this.machines.getAllAttackerMachines()
}

/**
 * @function getAllVictimMachines
 * @deprecated Access through .machines instead
 * @description Get a list of all victim machine objects
 * @memberof Scenario
 * @returns {Machine[]} Array of victim machines
 */
Scenario.prototype.getAllVictimMachines = function(){
    return this.machines.getAllVictimMachines()
}

/**
 * @function getAllMachines
 * @deprecated Access through .machines instead
 * @description Returns a list of all machine objects
 * @memberof Scenarios
 * @returns {Machine[]} Array of all machines
 */
Scenario.prototype.getAllMachines = function(){
    return this.machines.getAllMachines()
}

/**
 * @function getMachineByName
 * @deprecated Access through .machines instead
 * @description Returns instance of a machine with a specific name
 * @memberof Scenario
 * @param   {string} machineName Name of the machine to obtain
 * @returns {Machine}
 */
Scenario.prototype.getMachineByName = function(machineName){
    return this.machines.getMachineByName(machineName)
}


module.exports.Scenario = Scenario