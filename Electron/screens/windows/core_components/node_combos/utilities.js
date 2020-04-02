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