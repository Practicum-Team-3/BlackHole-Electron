/**
 * @class NodeCombos
 * @description Prepackaged components for using on a webpage
 *              Instantiate NodeCombos by passing a reference to the parent node
 *              and use methods to generate child nodes (components)
 * @param   {object} parentNode Node to add elements to
 */
function NodeCombos(parentNode){
    // Keep references to the parent node, and one for the current node
    // Nodes created by available functions will get added to currentNode
    this.parentNode = parentNode
    this.currentNode = parentNode
    // Place to keep reference to generated components used to make combos
    var nodes = {}
    this.collapsibleGroups = []
    
    this.getNodes = function(){
        return nodes
    }
    
    /**
     * @function getNewRow
     * @description Returns a new div with the style class of form-row to add components into
     * @returns {object} The div with form-row for css class
     */
    this.getNewRow = function(){
        var rowNode = document.createElement("div")
        rowNode.className = "form-row"
        return rowNode
    }
    
    /**
     * @function addReferenceToNode
     * @description Internal use. Just a fast way to store references to generated components into this.nodes
     * @param {string} nodeName Name to reference the component by
     * @param {object} node     Node to keep the reference of
     */
    this.addReferenceToNode = function(nodeName, node){
        if (nodeName!=null && nodeName!=""){
            nodes[nodeName] = node
        }
    }
    
    /**
     * @function selectNode
     * @description Sets the node to where all subsecuent created combos will be added
     * @param {object} node Node to select
     */
    this.selectNode = function(node){
        this.currentNode = node
    }
    
    /**
     * @function deselectNode
     * @description Resets the node to where all subsecuent
     *                  created combos will be added back into the original
     */
    this.deselectNode = function(){
        this.currentNode = this.parentNode
    }
}

/**
 * @function addCollapsibleGroup
 * @author Jose Guillen
 * @description Adds a collapsible group and selects it for all subsecuent created combos to be added inside
 * @param   {string} title        Title to give the collapsible group
 * @param   {string} iconLigature Optional: ligature of an icon to use on the group
 * @param   {string} dataParent   Optional: Parent of the group, only 1 group can be opened when under a parent
 */
NodeCombos.prototype.addCollapsibleGroup = function(title, iconLigature, dataParent){
    var groupId = generateUniqueId()
    
    //Make the title
    var group = addNode(this.currentNode, "div", "card")
    var header = addNode(group, "div", "card-header")
    var link = addHyperlinkNode(header, "card-link", "#"+groupId, getLinkHTML(title, iconLigature))
    link.setAttribute("data-toggle", "collapse")
    
    //Make a place for the content
    var collapse = addNode(group, "div", "collapse")
    collapse.setAttribute("id", groupId)
    if (dataParent!=null){
        collapse.setAttribute("data-parent", dataParent)
    }
    var body = addNode(collapse, "div", "card-body")
    
    // Add reference to group
    this.collapsibleGroups.push(group)
    
    // Select the group so all subsecuent combo creations get added into it
    this.selectNode(body)
    
    //Generates the html for inside the link
    function getLinkHTML(title, iconLigature){
        return (iconLigature==null ? "" : "<div class='iconArea'>"+iconLigature+"</div>")+title
    }
}

/**
 * @function addLabelPair
 * @author Jose Guillen
 * @description Adds a pair of label nodes inside a div node
 * @param {string} leftLabelName  Name to give the left label on the local reference
 * @param {string} leftLabelText  Text to add to the left label
 * @param {string} rightLabelName Name to give the right label on the local reference
 * @param {string} rightLabelText Text to add to the right label
 * @see getNodes
 */
NodeCombos.prototype.addLabelPair = function(leftLabelName, leftLabelText, rightLabelName, rightLabelText){
    var rowNode = this.getNewRow()
    
    var leftLabelNode = addLabelNode(rowNode, "col alignRight", leftLabelText)
    var rightLabelNode = addLabelNode(rowNode, "col alignLeft", rightLabelText)
    
    this.addReferenceToNode(leftLabelName, leftLabelNode)
    
    this.addReferenceToNode(rightLabelName, rightLabelNode)
    
    this.currentNode.appendChild(rowNode)
}

/**
 * @function addEditDeleteButtons
 * @author Jose Guillen
 * @description Adds two buttons side by side, one for an edit operation, the other for a delete operation
 * @param {string} editName      Name to give the edit button on the local reference
 * @param {function} editOnClick Reference to a function to call when the edit button gets clicked
 * @param {string} deleteName    Name to give the delete button on the local reference
 * @param {function} deleteOnClick Reference to a function to call when the delete button gets clicked
 */
NodeCombos.prototype.addEditDeleteButtons = function(editName, editOnClick, deleteName, deleteOnClick){
    var rowNode = this.getNewRow()
    
    var editButtonNode = addButtonNode(rowNode, "col ml-5 mr-1 mt-2 btn btn-primary", editOnClick, "Edit")
    var deleteButtonNode = addButtonNode(rowNode, "col ml-1 mr-5 mt-2 btn btn-danger", deleteOnClick, "Delete")
    
    this.addReferenceToNode(editName, editButtonNode)
    this.addReferenceToNode(deleteName, deleteButtonNode)
    
    this.currentNode.appendChild(rowNode)
}


NodeCombos.prototype.addDeleteAndIncludeButtons = function(deleteName, deleteOnClick, includeName, includeMachineOnClick){
    var rowNode = this.getNewRow()
    var deleteButtonNode = addButtonNode(rowNode, "col ml-5 mr-1 mt-2 btn btn-danger", deleteOnClick, "Delete")
    var includeButtonNode = addButtonNode(rowNode, "col ml-1 mr-5 mt-2 btn btn-success", includeMachineOnClick, "Include")
    
    this.addReferenceToNode(deleteName, deleteButtonNode)
    this.addReferenceToNode(includeName, includeButtonNode)
    
    this.currentNode.appendChild(rowNode)
}

/**
 * @function addLabelAndInput
 * @author Jose Guillen
 * @description Adds a text input with a label on the left
 * @param {string} labelName Name to give the label on the local reference
 * @param {string} labelText Text to put on the label
 * @param {string} inputName Name to give the text input on the local reference
 * @param {string} inputText Initial text to put on the text input
 */
NodeCombos.prototype.addLabelAndInput = function(labelName, labelText, inputName, inputText){
    var rowNode = this.getNewRow()
    
    var inputId = generateUniqueId()
    
    var labelNode = addLabelNode(rowNode, "col-5 alignRight", labelText, inputId)
    var inputNode = addInputNode(rowNode, "col form-control mb-1 mr-4", "text", inputText)
    
    inputNode.setAttribute("id", inputId)
    
    this.addReferenceToNode(labelName, labelNode)
    this.addReferenceToNode(inputName, inputNode)
    
    this.currentNode.appendChild(rowNode)
}

/**
 * @function addLabelAndSelect
 * @author Jose Guillen
 * @description Adds a select component with a label on its left
 * @param {string} labelName     Name to give the label on the local reference
 * @param {string} labelText     Text to put on the label
 * @param {string} selectName    Name to give the select on the local reference
 * @param {string[]} selectOptions Array of strings with the options for the select box
 */
NodeCombos.prototype.addLabelAndSelect = function(labelName, labelText, selectName, selectOptions){
    var rowNode = this.getNewRow()
    
    var labelNode = addLabelNode(rowNode, "col-5 alignRight", labelText)
    var selectNode = addSelectNode(rowNode, "col form-control mb-1 mr-4", selectOptions)
    
    this.addReferenceToNode(labelName, labelNode)
    this.addReferenceToNode(selectName, selectNode)
    
    this.currentNode.appendChild(rowNode)
}

/**
 * @function addCheckBox
 * @author Jose Guillen
 * @description Adds a checkbox with a label on the right
 * @param {string} checkboxName Name to give the checkbox on the local reference
 * @param {string} labelText    Text to put on the label
 */
NodeCombos.prototype.addCheckbox = function(checkboxName, labelText){
    var rowNode = this.getNewRow()
    
    var divNode = addNode(rowNode, "div", "col-5")
    var checkBoxNode = addCheckboxNode(rowNode, "col form-check-label alignLeft", labelText)
    
    this.addReferenceToNode(checkboxName, checkBoxNode)
    
    this.currentNode.appendChild(rowNode)
}


NodeCombos.prototype.addMultipleSections = function(sectionsLabelsList){
    for(var i=0; i<sectionsLabelsList.length;i++){
        var rowNode = this.getNewRow()
        rowNode.className = sectionsLabelsList[i]
        this.addReferenceToNode(sectionsLabelsList[i], rowNode)
        this.currentNode.appendChild(rowNode)
    }
}


NodeCombos.prototype.addOverviewOptionsButtons = function(nameAndHandlerDictionary){

    var keys = Object.keys(nameAndHandlerDictionary)

    var currentNode = this.currentNode
    var div = document.createElement("div")
    div.style = "height:100%; padding-top:5px"
    this.currentNode.appendChild(div)
    this.currentNode = div

    for(var i = 0; i<keys.length; i++){
        var rowNode = this.getNewRow()
        var placeholderBtn = addButtonNode(rowNode, "col mr-1 mt-2 btn btn-" + String(keys[i]).split("_")[1], nameAndHandlerDictionary[keys[i]], String(keys[i]).split("_")[0])
        this.addReferenceToNode(keys[i], placeholderBtn)
        this.currentNode.appendChild(placeholderBtn)
    }

    this.currentNode = currentNode
}