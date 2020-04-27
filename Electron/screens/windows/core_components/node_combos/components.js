// components.js
// Global functions to easily create and add specific nodes (components) in the DOM

/**
 * @function addBrNode
 * @description Adds a line break to a specific node
 * @param   {pbject} node Node to add the line break to
 * @returns {object} The line break node that was added
 */
function addBrNode(node){
    var brNode = document.createElement("br")
    node.appendChild(brNode)
    return brNode
}

/**
 * @function addHrNode
 * @description Adds a thematic break to a specific node
 * @param   {pbject} node Node to add the thematic break to
 * @returns {object} The line thematic break node that was added
 */
function addHrNode(node){
    var hrNode = document.createElement("hr")
    node.appendChild(hrNode)
    return hrNode
}

/**
 * @function addHyperlinkNode
 * @description Adds a hyperlink to a specific node
 * @param   {object} node      Node to add the hyperlink to
 * @param   {string} className Style classes to give the hyperlink node
 * @param   {string} href      Address of the link
 * @param   {string} innerHTML HTML to place inside the link. Can be just the text of the link
 * @returns {object} The hyperlink node that was added
 */
function addHyperlinkNode(node, className, href, innerHTML){
    var hyperlinkNode = document.createElement("a")
    hyperlinkNode.className = className
    hyperlinkNode.setAttribute("href", href)
    if (innerHTML!=null){
        hyperlinkNode.innerHTML = innerHTML
    }
    
    node.appendChild(hyperlinkNode)
    return hyperlinkNode
}

/**
 * function addNode
 * @description Appends a node of a specific type to another node
 * @param   {object} node      Node to add the new node to
 * @param   {string} nodename  Type of the node to add
 * @param   {string} className CSS class to give the new node
 * @param   {string} innerHTML html to add inside the new node
 * @returns {object} The new node
 */
function addNode(node, nodename, className, innerHTML){
    var genericNode = document.createElement(nodename)
    genericNode.className = className
    if (innerHTML!=null){
        genericNode.innerHTML = innerHTML
    }
    node.appendChild(genericNode)
    return genericNode
}

/**
 * @function addLabelNode
 * @description Adds a label to a specific node
 * @param   {object} node      Node to add the label to
 * @param   {string} className Style classes to give the label node
 * @param   {string} innerHTML HTML to place inside the label. Can be just the text of the label
 * @param   {string} forId     ID of the element to bind the label to
 * @returns {object} The label node that was added
 */
function addLabelNode(node, className, innerHTML, forId){
    var labelNode = document.createElement("label")
    labelNode.className = className
    labelNode.innerHTML = innerHTML
    if (forId!=null){
        labelNode.setAttribute("for", forId)
    }
    node.appendChild(labelNode)
    return labelNode
}

/**
 * @function addInputNode
 * @description Adds an input to a specific node
 * @param   {object} node      Node to add the input to
 * @param   {string} className Style classes to give the input node
 * @param   {string} type      Type of input to make (i.e. box, file)
 * @param   {string} value     Value of the input
 * @returns {object} The input node that was added
 */
function addInputNode(node, className, type, value){
    var inputNode = document.createElement("input")
    inputNode.className = className
    inputNode.setAttribute("type", type)
    inputNode.value = value
    
    node.appendChild(inputNode)
    return inputNode
}

/**
 * @function addButtonNode
 * @param   {object}   node      Node to add the button to
 * @param   {string}   className Style classes to give the button node
 * @param   {function} onClick   Reference to a function to call when the button gets clicked
 * @param   {string}   innerHTML HTML to place inside the button. Can be just the text of the button
 * @returns {object}   The button node that was added
 */
function addButtonNode(node, className, onClick, innerHTML){
    var buttonNode = document.createElement("button")
    buttonNode.className = className
    buttonNode.type = "button"
    if (onClick!=null){
        buttonNode.onclick = onClick
    }
    if (innerHTML!=null){
        buttonNode.innerHTML = innerHTML
    }
    node.appendChild(buttonNode)
    return buttonNode
}

function addFloatingButtonNode(node, onClick, icon){
    return addButtonNode(node, "floatingIconButton", onClick, icon)
}

/**
 * @function addSelectNode
 * @param   {object}   node      Node to add the select to
 * @param   {string}   className Style classes to give the select node
 * @param   {string[]} optionsList Array of strings with the options for the select
 * @returns {object}   The select node that was added
 */
function addSelectNode(node, className, optionsList){
    var selectNode = document.createElement("select")
    selectNode.className = className
    
    //create options
    optionsList.forEach(function(option){
        var optionNode = document.createElement("option")
        optionNode.innerHTML = option
        selectNode.appendChild(optionNode)
    })
    
    node.appendChild(selectNode)
    return selectNode
}

/**
 * @function addCheckbosNode
 * @param   {object}   node      Node to add the checkbox to
 * @param   {string}   className Style classes to give the checkbox node
 * @param   {string}   labelText Text next to the checkbox
 * @returns {object}   The checkbox node that was added
 */
function addCheckboxNode(node, className, labelText){
    var checkboxId = generateUniqueId()
    
    var checkboxLabelNode = document.createElement("label")
    checkboxLabelNode.setAttribute("for", checkboxId)
    checkboxLabelNode.className = className
    
    var checkboxNode = document.createElement("input")
    checkboxNode.className = "form-check-input"
    checkboxNode.setAttribute("type", "checkbox")
    checkboxNode.setAttribute("id", checkboxId)
    
    checkboxLabelNode.appendChild(checkboxNode)
    checkboxLabelNode.appendChild(document.createTextNode(labelText))
    
    node.appendChild(checkboxLabelNode)
    return checkboxNode
}

/**
 * @function addListGroup
 * @todo Add option for floating button
 * @param   {object}   node                 Node to add the list to
 * @param   {string}   className            Style classes to give the ul
 * @returns {object}   The list node that was added
 */
function addListGroupNode(node, className){
    var listNode = document.createElement("ul")
    listNode.className = className
    
    node.appendChild(listNode)
    return listNode
}

/**
 * @function addItemsToList
 * @param   {object} listNode  List node to add the items to
 * @param   {string}   itemClassName        Style classes to give the list items
 * @param   {string[]} itemList             Array with the contents of the list items
 * @param {function} itemAction           Optional: Function called when the item gets clicked
 * @param {function} detailAction         Optional: Function called with the detail icon gets clicked
 * @param {string}   detailActionLigature Optional: Ligature for the detail icon
 */
function addItemsToList(listNode, itemClassName, itemList, itemAction, detailAction, detailActionLigature){
    itemList.forEach(function(item){
        var itemNode = addItemToList(listNode, itemClassName, item, itemAction, detailAction, detailActionLigature)
    })
}

/**
 * @function addItemToList
 * @description Adds an item node to a list node. Sets the original label on the .label property of the node
 * @param   {object} listNode  List node to add the item to
 * @param   {string} className Style classes to give the li item
 * @param   {string} innerHTML HTML to place inside the item
 * @param {function} itemAction Optional: Function called when the item gets clicked
 * @param {function} detailAction Optional: Function called with the detail icon gets clicked
 * @param {string} detailActionLigature Optional: Ligature for the detail icon
 * @returns {object} The item node that was added
 */
function addItemToList(listNode, className, innerHTML, itemAction, detailAction, detailActionLigature){
    var itemNode = addNode(listNode, "li", className, innerHTML)
    itemNode.label = innerHTML
    
    if (itemAction!=null){
        itemNode.onclick = itemAction
    }
    if (detailAction!=null){
        addFloatingButtonNode(itemNode, detailAction, detailActionLigature)
    }
    
    return itemNode
}

/**
 * @function addRangeNode
 * @param   {object} node      Node to add the range to
 * @param   {string} className Style classes to give the range node
 * @param   {number} min       Minimum value for the range
 * @param   {number} max       Maximum value for the range
 * @param   {number} step      Step size
 * @param   {number} value     Starting value
 * @returns {object The range node that was added
 */
function addRangeNode(node, className, min, max, step, value){
    var rangeNode = document.createElement("input")
    rangeNode.className = className
    rangeNode.setAttribute("type", "range")
    rangeNode.min = min
    rangeNode.max = max
    rangeNode.step = step
    rangeNode.value = value
    
    node.appendChild(rangeNode)
    return rangeNode
}
