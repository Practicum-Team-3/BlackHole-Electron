/**
 * @function generateUniqueId
 * @returns {string} Unique string ID for the session
 */
function generateUniqueId(){
    var id = ""
    do{
        id = "a"+Math.random().toString(36).substring(5)
    }while(idList.has(id))
    idList.add(id)
    return id
}
var idList = new Set()

/**
 * @function getUrlVars
 * @returns {vars{}} Object with name value pairs of url parameters
 */
function getUrlVars() {
    var vars = {};
    
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&#]*)/gi, function(m,key,value) {
        vars[key] = decodeURIComponent(value);
    });
    return vars;
}

/**
 * @function setDisabled
 * @description Set the disabled property of all elements of a specific class name
 * @param {boolean} disabled        Value to set on disabled property
 * @param {string} targetClassName Class name of the target elements
 */
function setDisabled(disabled, targetClassName){
    var formElements = document.getElementsByClassName(targetClassName)
    for (var i=0; i<formElements.length; i++){
        formElements[i].disabled = disabled
    }
}