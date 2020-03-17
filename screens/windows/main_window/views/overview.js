
/**
 * @class Overview
 * @description Model for the overview panel
 */
function Overview(){
    // Create a form to put all of the components in
    var formNode = document.createElement("form")
    formNode.setAttribute("onSubmit", "return false")
    
    // Create a NodeCombos instance to add prepackaged components and keep a reference to them
    var interface = new NodeCombos(formNode)
    
    addInterfaceNodes()
    
    // Generates the interface by making calls to NodeCombos (interface)
    function addInterfaceNodes(){
    
        
    }
    
    this.getInterface = function(){
        return interface
    }
    
    this.getNode = function(nodeName){
        return this.getInterface().getNodes()[nodeName]
    }
}