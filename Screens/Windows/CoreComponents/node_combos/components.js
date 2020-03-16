// Functions to easily create and add specific nodes (components) in the DOM

function addBrNode(node){
    var brNode = document.createElement("br")
    node.appendChild(brNode)
    return brNode
}

function addHrNode(node){
    var hrNode = document.createElement("hr")
    node.appendChild(hrNode)
    return hrNode
}

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

function addInputNode(node, className, type , value){
    var inputNode = document.createElement("input")
    inputNode.className = className
    inputNode.setAttribute("type", type)
    inputNode.value = value
    
    node.appendChild(inputNode)
    return inputNode
}

function addButtonNode(node, className, onClick, innerHTML){
    var buttonNode = document.createElement("button")
    buttonNode.className = className
    if (onClick!=null){
        inputNode.setAttribute("onClick", onClick)
    }
    if (innerHTML!=null){
        buttonNode.innerHTML = innerHTML
    }
    node.appendChild(buttonNode)
    return buttonNode
}

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

function addCheckboxNode(node, className, innerHTML){
    var checkboxId = generateUniqueId()
    
    var checkboxLabelNode = document.createElement("label")
    checkboxLabelNode.setAttribute("for", checkboxId)
    checkboxLabelNode.className = className
    
    var checkboxNode = document.createElement("input")
    checkboxNode.className = "form-check-input"
    checkboxNode.setAttribute("type", "checkbox")
    checkboxNode.setAttribute("id", checkboxId)
    
    checkboxLabelNode.appendChild(checkboxNode)
    checkboxLabelNode.innerHTML += innerHTML
    
    node.appendChild(checkboxLabelNode)
    return checkboxNode
}