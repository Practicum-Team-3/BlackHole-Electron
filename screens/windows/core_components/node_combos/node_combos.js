/**
 * @class NodeCombos
 * @description Prepackaged components for using on a webpage
 *              Instantiate NodeCombos by passing a reference to the parent node
 *              and use methods to generate child nodes (components)
 * @param   {object} parentNode Node to add elements to
 */
function NodeCombos(parentNode){
    this.parentNode = parentNode
    this.currentNode = parentNode
    var nodes = {}
    var collapsibleGroups = []
    
    this.getNodes = function(){
        return nodes
    }
    
    this.getNewRow = function(){
        var rowNode = document.createElement("div")
        rowNode.className = "form-row"
        return rowNode
    }
    
    this.addReferenceToNode = function(nodeName, node){
        if (nodeName!=null && nodeName!=""){
            nodes[nodeName] = node
        }
    }
    
    this.deselectNode = function(){
        this.currentNode = this.parentNode
    }
    
    this.selectNode = function(node){
        this.currentNode = node
    }
}

NodeCombos.prototype.addCollapsibleGroup = function(title, iconLigature, dataParent){
    var groupId = generateUniqueId()
    
    //Make the title
    var group = addNode(this.currentNode, "div", "card")
    var header = addNode(group, "div", "card-header")
    var link = addHyperlinkNode(header, "card-link", "#"+groupId, getLinkHTML(title, iconLigature))
    link.setAttribute("data-toggle", "collapse")
    
    //Make a place for the content
    var collapse = addNode(group, "div", "collapse show")
    collapse.setAttribute("id", groupId)
    if (dataParent!=null){
        collapse.setAttribute("data-parent", dataParent)
    }
    var body = addNode(collapse, "div", "card-body")
    
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

NodeCombos.prototype.addEditDeleteButtons = function(editName, editOnClick, deleteName, deleteOnClick){
    var rowNode = this.getNewRow()
    
    var editButtonNode = addButtonNode(rowNode, "col ml-5 mr-1 mt-2 btn btn-primary", editOnClick, "Edit")
    var deleteButtonNode = addButtonNode(rowNode, "col ml-1 mr-5 mt-2 btn btn-danger", deleteOnClick, "Delete")
    
    this.addReferenceToNode(editName, editButtonNode)
    this.addReferenceToNode(deleteName, deleteButtonNode)
    
    this.currentNode.appendChild(rowNode)
}

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

NodeCombos.prototype.addLabelAndSelect = function(labelName, labelText, selectName, selectOptions){
    var rowNode = this.getNewRow()
    
    var labelNode = addLabelNode(rowNode, "col-5 alignRight", labelText)
    var selectNode = addSelectNode(rowNode, "col form-control mb-1 mr-4", selectOptions)
    
    this.addReferenceToNode(labelName, labelNode)
    this.addReferenceToNode(selectName, selectNode)
    
    this.currentNode.appendChild(rowNode)
}

NodeCombos.prototype.addCheckbox = function(checkboxName, labelText){
    var rowNode = this.getNewRow()
    
    var divNode = addNode(rowNode, "div", "col-5")
    var checkBoxNode = addCheckboxNode(rowNode, "col form-check-label alignLeft", labelText)
    
    this.addReferenceToNode(checkboxName, checkBoxNode)
    
    this.currentNode.appendChild(rowNode)
}