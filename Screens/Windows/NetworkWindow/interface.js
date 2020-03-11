var tabBar = null
var idList = new Set()
// To store references to central views indexed by scenario name
var centralViews = {}
var selectedScenarioName = ""
var selectedScenario = null
var selectedMachine = null
try{
    window.$ = window.jQuery = require("../../../Electron/node_modules/jquery/dist/jquery")
}catch{}
    
window.onload = function(){
    tabBar = document.getElementById("tabBar")
    
    selectedScenarioName = getUrlVars()["scenario"]
    
    if (selectedScenarioName==null){//Maybe new scenario
        selectedScenarioName = "foo"
        selectedScenario = widow.scenarios.getScenarioBeingCreated()
    }else{
        selectedScenarioName = decodeURIComponent(selectedScenarioName)
        selectedScenario = widow.scenarios.getScenarioByName(selectedScenarioName)
    }
    
    makeTabAndSectionForScenario(selectedScenarioName)
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function runScenario(){
    console.log("Running...")
    widow.scenarios.createVagrant(selectedScenarioName).then(function(){
        console.log("Vagrant created")
        return widow.scenarios.run(selectedScenarioName)
    }).then(function(){
        console.log("Running")
    })
}


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

function makeTabAndSectionForScenario(scenarioName){
    //Make the section
    var id = addCentralViewForScenario(scenarioName)
    //Do the fields here for now
    //TODO: give this another home
    
    if (selectedScenario!=null){
        if (selectedScenario.getAllVictimMachines().length>0){
            selectedMachine = selectedScenario.getAllVictimMachines()[0]
            console.log("Loaded Machine")
            
            var centralView = centralViews[scenarioName]
            centralView.machineInfo.domElements["nameValue"].innerHTML = selectedMachine.getName()
            centralView.machineInfo.domElements["osValue"].innerHTML = selectedMachine.getOs()
            centralView.machineInfo.domElements["vulnerabilityValue"].innerHTML = selectedScenario.vulnerabilityInfo.getName()
            centralView.machineInfo.domElements["guiValue"].innerHTML = selectedMachine.getGui()
            
            centralView.machineInfo.domElements["ipValue"].value = selectedMachine.networkSettings.getIpAddress()
            centralView.machineInfo.domElements["networkValue"].value = selectedMachine.networkSettings.getNetworkName()
        }
    }
    //Then make the tab
    addTab(scenarioName, "#"+id)
}

function addTab(label, href){
    let newTab = document.createElement("li")
    newTab.className = "nav-item"
    
    let tabLink = document.createElement("a")
    tabLink.className = "nav-link"
    tabLink.setAttribute("data-toggle", "tab")
    tabLink.setAttribute("href", href)
    tabLink.innerHTML = label
    
    newTab.appendChild(tabLink)
    tabBar.appendChild(newTab)
    
    $(tabLink).tab('show')
}

/**
 * @function addSection
 * @description Adds a new section available for content
 * @returns {string} ID of the new section
 */
function addCentralViewForScenario(scenarioName){
    
    //create a single tab (AKA central view) dom
    var centralViewDom = document.createElement("div")
    centralViewDom.className = "tab-pane fade singleCentralView"
    centralViewDom.id = generateUniqueId()
    
    //create referencer object
    var centralView = new CentralView(centralViewDom)
    
    //Go deeper into the creation by passing the referencer class
    createMainSectionsForCentralView(centralView)
 
    //this gets real
    document.getElementById("centralViewContainer").appendChild(centralViewDom)
    
    // Add referencer object object to central views dictionary
    centralViews[scenarioName] = centralView
    
    return centralViewDom.id
}

function createMainSectionsForCentralView(centralView){
    //Make network graph space===
    var netGraphDom = document.createElement("div")
    netGraphDom.className = "networkGraphContainer"
    netGraphDom.setAttribute("style", "flex-grow: 3")
    //create referencer object and save
    centralView.netGraph = new NetGraph(netGraphDom)
    //Go deeper
    // STUB: implement 'deeper' for net graph
    //This gets real (Add to centralView's dom)
    centralView.dom.appendChild(netGraphDom)

    //Make machine info===
    var machineInfoDom = document.createElement("div")
    machineInfoDom.className = "machineInfoContainer"
    machineInfoDom.setAttribute("style", "flex: 0 0 300px")
    //create referencer object and save
    centralView.machineInfo = new MachineInfo(machineInfoDom)
    //Go deeper into the creation by passing referencer class
    createFormsForMachineInfo(centralView.machineInfo)
    //This gets real (Add to centralView's dom)
    centralView.dom.appendChild(machineInfoDom)
}


function createFormsForMachineInfo(machineInfo){
    //create main form
    var formDom = document.createElement("form")
    formDom.setAttribute("action", "#")
    
    //Add stuff to the form
    addLabel(formDom, "", "desktop", machineInfo)
    
    addFormRowWithTwoLabels(formDom, "", "Name:", "nameValue", "", machineInfo)
    addFormRowWithTwoLabels(formDom, "", "OS:", "osValue", "", machineInfo)
    addFormRowWithTwoLabels(formDom, "", "Vulnerability:", "vulnerabilityValue", "", machineInfo)
    addFormRowWithTwoLabels(formDom, "", "GUI:", "guiValue", "", machineInfo)
    
    addEditDeleteButtons(formDom, machineInfo)
    addDivider(formDom)
    addLabelAndInput(formDom, "", "Network:", "networkValue", "", machineInfo)
    addLabelAndInput(formDom, "", "IP:", "ipValue", "127.0.0.1", machineInfo)
    addDivider(formDom)
    addLabelAndSelect(formDom, "", "Collector:", "collector", ["ECELd"], machineInfo)
    addBrDom(formDom)
    addLoneCheckbox(formDom, "networkTraffic", "Network Traffic", machineInfo)
    addLoneCheckbox(formDom, "systemLogs", "System Logs", machineInfo)
    addLoneCheckbox(formDom, "apiCalls", "API Calls", machineInfo)
    addBrDom(formDom)
    
    addLabelAndSelect(formDom, "", "Start:", "startCondition", ["Total Eclipse"], machineInfo)
    addLabelAndSelect(formDom, "", "Stop:", "stopCondition", ["Earthquake"], machineInfo)
    
    addLoneCheckbox(formDom, "timeout", "Timeout", machineInfo)
    
    addDivider(formDom)
    addLabelAndSelect(formDom, "", "Program:", "program", [""], machineInfo)
    addLabelAndInput(formDom, "", "Path:", "path", "", machineInfo)
    addLabelAndInput(formDom, "", "Start Time:", "startTime", "23:59", machineInfo)
    
    machineInfo.dom.appendChild(formDom)
}

/* Rows */

function addFormRowWithTwoLabels(formDom, label1Name, label1Text, label2Name, label2Text, machineInfo){
    var rowDom = getNewRow()
    
    //Add stuff
    addLabelDom(rowDom, label1Name, "col alignRight", label1Text, machineInfo)
    addLabelDom(rowDom, label2Name, "col alignLeft", label2Text, machineInfo)
    
    //Gets real
    formDom.appendChild(rowDom)
}

function addEditDeleteButtons(formDom, machineInfo){
    var rowDom = getNewRow()
    
    //Add stuff
    addButtonDom(rowDom, "editButton", "col ml-5 mr-1 btn btn-primary mt-3", "Edit", machineInfo)
    addButtonDom(rowDom, "deleteButton", "col ml-1 mr-5 btn btn-danger mt-3", "Delete", machineInfo)
    
    formDom.appendChild(rowDom)
}

function addLabel(formDom, labelName, labelText, machineInfo){
    var rowDom = getNewRow()

    addLabelDom(rowDom, labelName, "col alignRight bigIcon", labelText, machineInfo)

    formDom.appendChild(rowDom)
}

function addLabelAndInput(formDom, labelName, labelText, inputName, inputText, machineInfo){
    var rowDom = getNewRow()
    
    addLabelDom(rowDom, labelName, "col alignRight", labelText, machineInfo)
    addInputDom(rowDom, inputName, "text", "col form-control ml-1 mb-1 mr-5", inputText, machineInfo)
    
    formDom.appendChild(rowDom)
}

function addLabelAndSelect(formDom, labelName, labelText, selectName, selectOptions, machineInfo){
    var rowDom = getNewRow()
    
    addLabelDom(rowDom, labelName, "col alignRight", labelText, machineInfo)
    addSelectDom(rowDom, selectName, selectOptions, "col form-control ml-1 mb-1 mr-5", machineInfo)
    
    formDom.appendChild(rowDom)
}

function addLoneCheckbox(formDom, checkboxName, checkboxText, machineInfo){
    var rowDom = getNewRow()
    
    addCheckboxDom(rowDom, checkboxName, "col form-check-label alignLeft ml-5", checkboxText, machineInfo)
    
    formDom.appendChild(rowDom)
}

/* Lowest level elements */

function getNewRow(){
    var rowDom = document.createElement("div")
    rowDom.className = "row"
    return rowDom
}

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


/* Add reference */
function addReferenceToDomElement(machineInfo, dom, name){
    if (name!=""){
        machineInfo.domElements[name] = dom
    }
}


//======================
//===WINDOW CONSTR
//======================
//Central view
function CentralView(dom){
    this.dom = dom
    this.netGraph = null
    this.machineInfo = null
}

function NetGraph(dom){
    this.dom = dom
}

function MachineInfo(dom){
    this.dom = dom
    this.image = null
    this.domElements = {}
}




