/**
 * @class NodeCombos
 * @description Prepackaged components for using on a webpage
 *              Instantiate NodeCombos by passing a reference to the parent node
 *              and use methods to generate child nodes (components).
 *              Some child nodes are added listeners to upon creation.
 *              To destroy NodeCombos, but keep orphan components, call turnToOrphans()
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
    
    // Callback for edit events
    var onchangeCallback = null
    
    /**
     * @function turnToOrphans
     * @description Unbind NodeCombos from created nodes in every way
     */
    this.turnToOrphans = function(){
        for (nodeName in nodes){
            //Unbind from possible onchange listener
            nodes[nodeName].removeEventListener("change", this.onchange);
        }
    }
    
    this.getNodes = function(){
        return nodes
    }
    
    this.getNode = function(nodeName){
        return nodes[nodeName]
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
    //========================
    //=== Internal reference adding
    //========================
    /**
     * @function addReferenceToNode
     * @private
     * @description Internal use. Fast way to store references to generated components into this.nodes
     * @param {string} nodeName Name to reference the component by
     * @param {object} node     Node to keep the reference of
     */
    this.addReferenceToNode = function(nodeName, node){
        if (nodeName!=null && nodeName!=""){
            nodes[nodeName] = node
            node.setAttribute("comboname", nodeName)
        }
    }
    
    /**
     * @function addReferenceAndListenerToNode
     * @private
     * @description Internal use. Fast way to store references to generated components into this.nodes
     *                  and to add listener for the change event
     * @param {string} nodeName Name to reference the component by
     * @param {object} node     Node to keep the reference of
     */
    this.addReferenceAndListenerToNode = function(nodeName, node){
        this.addReferenceToNode(nodeName, node)
        //Add listener
        //Warning: Persistent reference to "this"
        //No problem if destroying both NodeCombos and related nodes
        //If just destroying NodeCombos, call .turnToOrphans() first
        node.addEventListener("change", this.onchange);
    }
    //========================
    //=== Node Selection
    //========================
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
    //========================
    //=== onchange
    //========================
    /**
     * @function setOnchangeCallback
     * @description Add a callback for when an element triggers an onchange event
     * @param {function} callback Function that takes one parameter for the name of the element that triggered the onchange event
     */
    this.setOnchangeCallback = function(callback){
        onchangeCallback = callback
    }
    
    /**
     * @function onchange
     * @private
     * @description Receiver for onchange events. Identifies the node that generated the event and emits the event on the callback.
     * @param {Event} event Event information
     */
    this.onchange = (function(event){
        if (onchangeCallback!=null){
            var target = event.target
            // Preprocess value (for when the element does not already return the desired value format)
            var value = target.value
            //Handle values for special types
            switch (target.type){
                
            }
            onchangeCallback(event.target.getAttribute("comboname"), event.target, value)
        }
    }).bind(this)
}

/**
 * @function addCollapsibleGroup
 * @author Jose Guillen
 * @description Adds a collapsible group and selects it for all subsecuent created combos to be added inside
 * @param   {string} groupName     Name to give the top node of the group on the local reference. 
 *                                 To access the body of the group, a reference is set on the group itself in .groupBody
 * @param   {string}  title        Title to give the collapsible group
 * @param   {string}  iconLigature Optional: ligature of an icon to use on the group
 * @param   {string}  dataParent   Optional: Parent of the group, only 1 group can be opened when under a parent
 * @param   {boolean} willShow     Optional: Boolean for if group should be open by default
 * @returns {object} The top node of the group
 */
NodeCombos.prototype.addCollapsibleGroup = function(groupName, title, iconLigature, dataParent, willShow){
    var groupId = generateUniqueId()
    
    //Make the title
    var group = addNode(this.currentNode, "div", "card")
    var header = addNode(group, "div", "card-header")
    var link = addHyperlinkNode(header, "card-link", "#"+groupId, getLinkHTML(title, iconLigature))
    link.setAttribute("data-toggle", "collapse")
    
    //Make a place for the content
    var collapse = addNode(group, "div", "collapse"+(willShow?" show":""))
    collapse.setAttribute("id", groupId)
    if (dataParent!=null){
        collapse.setAttribute("data-parent", dataParent)
    }
    var body = addNode(collapse, "div", "card-body")
    
    // Add reference to group
    this.collapsibleGroups.push(group)
    
    this.addReferenceToNode(groupName, group)
    
    //Add reference to body on itself
    group.groupBody = body
    
    // Select the group so all subsecuent combo creations get added into it
    this.selectNode(body)
    
    return group
    
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
    
    var leftLabelNode = addLabelNode(rowNode, "col-6 alignRight font-weight-bold", leftLabelText)
    var rightLabelNode = addLabelNode(rowNode, "col-6 alignLeft", rightLabelText)
    
    this.addReferenceToNode(leftLabelName, leftLabelNode)
    this.addReferenceToNode(rightLabelName, rightLabelNode)
    
    this.currentNode.appendChild(rowNode)
}

NodeCombos.prototype.addLabelPairLeft = function(leftLabelName, leftLabelText, rightLabelName, rightLabelText){
    var rowNode = this.getNewRow()
    
    var leftLabelNode = addLabelNode(rowNode, "ml-4 font-weight-bold", leftLabelText)
    var rightLabelNode = addLabelNode(rowNode, "col-6 alignLeft", rightLabelText)
    
    this.addReferenceToNode(leftLabelName, leftLabelNode)
    this.addReferenceToNode(rightLabelName, rightLabelNode)
    
    this.currentNode.appendChild(rowNode)
}

NodeCombos.prototype.addLabel = function(labelName, labelText){
    
    var labelNode = addLabelNode(this.currentNode, "ml-4 font-weight-bold", labelText)
    
    this.addReferenceToNode(labelName, labelNode)
}

/**
 * @function addSingleButton
 * @author Aaron Himan
 * @description Adds one single button
 * @param {string} buttonName Name to give the button
 * @param {string} style Style classes to give the button
 * @param {function} functionOnClick Reference to a function to call when the button gets clicked * 
 */
NodeCombos.prototype.addSingleButton = function(buttonName, style, functionOnClick){
    var rowNode = this.getNewRow()

    var buttonNode = addButtonNode(rowNode, style, functionOnClick, buttonName)

    this.addReferenceToNode(buttonName, buttonNode)

    this.currentNode.appendChild(rowNode)
}

/**
 * @function addButtonPair
 * @author Jose Guillen
 * @description Adds two buttons side by side
 * @param {string} leftButtonName      Name to give the left button on the local reference
 * @param {string} leftButtonLabel Label for the left button
 * @param {string} leftButtonClassName Class of the left button
 * @param {function} leftOnClick Reference to a function to call when the left button gets clicked
 * @param {string} rightButtonName    Name to give the right button on the local reference
 * @param {string} rightButtonLabel Label for the right button
 * @param {string} rightButtonClassName Class of the right button
 * @param {function} rightOnClick Reference to a function to call when the right button gets clicked
 */
NodeCombos.prototype.addButtonPair = function(leftButtonName, leftButtonLabel, leftButtonClassName, leftOnClick, rightButtonName, rightButtonLabel, rightButtonClassName, rightOnClick){
    var rowNode = this.getNewRow()
    
    var leftButtonNode = addButtonNode(rowNode, leftButtonClassName, leftOnClick, leftButtonLabel)
    var rightButtonNode = addButtonNode(rowNode, rightButtonClassName, rightOnClick, rightButtonLabel)
    
    this.addReferenceToNode(leftButtonName, leftButtonNode)
    this.addReferenceToNode(rightButtonName, rightButtonNode)
    
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
    this.addButtonPair(editName, "Edit", "col ml-5 mr-1 mt-2 btn btn-primary", editOnClick, deleteName, "Delete", "col ml-1 mr-5 mt-2 btn btn-danger", deleteOnClick)
}

NodeCombos.prototype.addOpenEditButtons = function(openName, openOnClick, editName, editOnClick){
    this.addButtonPair(openName, "Open", "col ml-5 mr-1 mt-2 btn btn-success", openOnClick, editName, "Delete", "col ml-1 mr-5 mt-2 btn btn-danger", editOnClick)
}

NodeCombos.prototype.addDeleteAndIncludeButtons = function(deleteName, deleteOnClick, includeName, includeMachineOnClick){
    this.addButtonPair(deleteName, "Delete", "col ml-5 mr-1 mt-2 btn btn-danger", deleteOnClick, includeName, "Include", "col ml-1 mr-5 mt-2 btn btn-success", includeMachineOnClick)
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
    
    var labelNode = addLabelNode(this.currentNode, "ml-4 mb-0 alignRight font-weight-bold", labelText, inputId)
    var inputNode = addInputNode(rowNode, "col form-control ml-5 mr-5 mb-1", "text", inputText)
    
    inputNode.setAttribute("id", inputId)
    
    this.addReferenceToNode(labelName, labelNode)
    this.addReferenceAndListenerToNode(inputName, inputNode)
    
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
    
    var labelNode = addLabelNode(this.currentNode, "ml-4 mb-0 alignRight font-weight-bold", labelText)
    var selectNode = addSelectNode(rowNode, "col form-control ml-5 mr-5 mb-1", selectOptions)
    
    this.addReferenceToNode(labelName, labelNode)
    this.addReferenceAndListenerToNode(selectName, selectNode)
    
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
    var checkboxNode = addCheckboxNode(rowNode, "col form-check-label alignLeft", labelText)
    
    this.addReferenceAndListenerToNode(checkboxName, checkboxNode)
    
    this.currentNode.appendChild(rowNode)
}

/**
 * @function addRangeAndValue
 * @param {string} rangeName Name to give the range on the local reference
 * @param   {number} min       Minimum value for the range
 * @param   {number} max       Maximum value for the range
 * @param   {number} step      Step size
 * @param   {number} value     Starting value
 */
NodeCombos.prototype.addRangeAndValue = function(rangeName, min, max, step, value){
    var rowNode = this.getNewRow()
    
    var rangeNode = addRangeNode(rowNode, "custom-range col-9 pl-5", min, max, step, value)
    var labelNode = addLabelNode(rowNode, "col-3 alignLeft", value)
    
    rangeNode.oninput = function(event){
        this.innerHTML = event.target.value
    }.bind(labelNode)
    
    this.addReferenceAndListenerToNode(rangeName, rangeNode)
    
    this.currentNode.appendChild(rowNode)
}

/**
 * @function addMultipleSections
 * @description Adds multiple rows
 * @author Unknown
 * @param {string[]} sectionsLabelsList Array with the names of the rows for the local reference
 */
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
    div.style = "padding:5px"
    this.currentNode.appendChild(div)
    this.currentNode = div

    for(var i = 0; i<keys.length; i++){
        var rowNode = this.getNewRow()
        var placeholderBtn = addButtonNode(rowNode, "col mt-1 mb-1 btn btn-" + String(keys[i]).split("_")[1], nameAndHandlerDictionary[keys[i]], String(keys[i]).split("_")[0])
        this.addReferenceToNode(keys[i], placeholderBtn)
        this.currentNode.appendChild(placeholderBtn)
    }

    this.currentNode = currentNode
}

/**
 * @function addVerticalList
 * @description Make a vertically stacked list with initial items
 * @author Jose Guillen
 * @param {string} listName  Name to give the list
 * @param {string[]} listItems Array with item string labels
 * @param {function} itemAction Optional: Pointer to a function to be called when the item is clicked
 * @param {function} detailAction Optional: Pointer to a function to be called when the item detail is clicked.
 *                                When the detail gets clicked, the itemAction will also get called;
 *                                call event.stopPropagation() in detailAction to prevent
 * @param {string} detailActionLigature Optional: String with the ligature of the icon to use for the item details
 */
NodeCombos.prototype.addVerticalList = function(listName, listItems, itemAction, detailAction, detailActionLigature){
    var listNode = addListGroupNode(this.currentNode, "list-group pl-4 pr-4")
    
    this.addItemsToVerticalList(listNode, listItems, itemAction, detailAction, detailActionLigature)
    
    this.addReferenceToNode(listName, listNode)
}

NodeCombos.prototype.addItemsToVerticalList = function(listNode, listItems, itemAction, detailAction, detailActionLigature){
    var itemClassName = itemAction==null ? "list-group-item" : "list-group-item list-group-item-action"
    
    addItemsToList(listNode, itemClassName, listItems, itemAction, detailAction, detailActionLigature)
}