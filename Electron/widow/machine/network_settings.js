/**
 * @class NetworkSettings
 * @version 1.0.0
 * @param {Object} descriptor Network descriptor object
 */
function NetworkSettings(descriptor){
    this.descriptor = descriptor
}

/**
 * @function setNetworkName
 * @description Set the network name
 * @memberof NetworkSettings
 * @param {string} networkName Name to give the network
 */
NetworkSettings.prototype.setNetworkName = function(networkName){
    this.descriptor["network_name"] = networkName
}

/**
 * @function getNetworkName
 * @description Returns the current name of the network
 * @memberof NetworkSettings
 * @returns {string} Current name of the network
 */
NetworkSettings.prototype.getNetworkName = function(){
    return this.descriptor["network_name"]
}

//== Network Type
/**
 * @function setNetworkType
 * @memberof NetworkSettings
 * @param {string} networkType Type of the network
 */
NetworkSettings.prototype.setNetworkType = function(networkType){
    this.descriptor["network_type"] = networkType
}

/**
 * @function getNetworkType
 * @memberof NetworkSettings
 * @returns {string} Network type
 */
NetworkSettings.prototype.getNetworkType = function(){
    return this.descriptor["network_type"]
}

//== IP Address
/**
 * @function setIpAddress
 * @memberof NetworkSettings
 * @param {string} ipAddress IP Address of the machine
 */
NetworkSettings.prototype.setIpAddress = function(ipAddress){
    this.descriptor["ip_address"] = ipAddress
}

/**
 * @function getIpAddress
 * @memberof NetworkSettings
 * @returns {string} IP Address of the machine
 */
NetworkSettings.prototype.getIpAddress = function(){
    return this.descriptor["ip_address"]
}

//== Auto config
/**
 * @function setAutoConfig
 * @memberof NetworkSettings
 * @param {boolean} autoConfig Boolean for automatic configuration
 */
NetworkSettings.prototype.setAutoConfig = function(autoConfig){
    this.descriptor["auto_config"] = autoConfig
}

/**
 * @function getAutoConfig
 * @memberof NetworkSettings
 * @returns {boolean} Boolean for automatic configuration
 */
NetworkSettings.prototype.getAutoConfig = function(){
    return this.descriptor["auto_config"]
}

module.exports.NetworkSettings = NetworkSettings