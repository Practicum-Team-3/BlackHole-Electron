function addBrDom(rowDom){
    var brDom = document.createElement("br")
    rowDom.appendChild(brDom)
}

function addDivider(rowDom){
    var hrDom = document.createElement("hr")
    rowDom.appendChild(hrDom)
}

function addLabelDom(rowDom, labelName, className, text, machineInfo){
    var labelDom = document.createElement("div")
    labelDom.className = className
    labelDom.innerHTML = text
    //Add reference to dom
    addReferenceToDomElement(machineInfo, labelDom, labelName)
    //Gets real
    rowDom.appendChild(labelDom)
}

function addInputDom(rowDom, inputName, type, className, text, machineInfo){
    //<input type="text" class="form-control mb-2 mr-sm-2" id="email2" placeholder="Enter email" name="email">
    var inputDom = document.createElement("input")
    inputDom.className = className
    inputDom.setAttribute("type", type)
    inputDom.value = text
    //Add reference to dom
    addReferenceToDomElement(machineInfo, inputDom, inputName)
    //Gets real
    rowDom.appendChild(inputDom)
}

function addButtonDom(rowDom, buttonName, className, text, machineInfo){
    var buttonDom = document.createElement("button")
    buttonDom.className = className
    buttonDom.innerHTML = text
    //Add reference to dom
    addReferenceToDomElement(machineInfo, buttonDom, buttonName)
    //Gets real
    rowDom.appendChild(buttonDom)
}

function addSelectDom(rowDom, selectName, optionsList, className, machineInfo){
    var selectDom = document.createElement("select")
    selectDom.className = className
    
    //create options
    optionsList.forEach(function(option){
        var optionDom = document.createElement("option")
        optionDom.innerHTML = option
        selectDom.appendChild(optionDom)
    })
    
    //Add reference to dom
    addReferenceToDomElement(machineInfo, selectDom, selectName)
    //Gets real
    rowDom.appendChild(selectDom)
}

function addCheckboxDom(rowDom, checkboxName, className, text, machineInfo){
    var checkboxLabelDom = document.createElement("label")
    checkboxLabelDom.setAttribute("for", checkboxName)
    checkboxLabelDom.className = className
    
    var checkboxDom = document.createElement("input")
    checkboxDom.className = "form-check-input"
    checkboxDom.setAttribute("type", "checkbox")
    checkboxDom.setAttribute("id", checkboxName)
    
    
    //Add reference to dom
    addReferenceToDomElement(machineInfo, checkboxDom, checkboxName)
    //Gets real
    checkboxLabelDom.appendChild(checkboxDom)
    checkboxLabelDom.innerHTML += text
    //Gets realer
    rowDom.appendChild(checkboxLabelDom)
}