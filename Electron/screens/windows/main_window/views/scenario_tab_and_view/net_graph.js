
function NetGraph(scenario, parent){

    this.parentNode = parent
    this.scenario = scenario

    this.d3 = require("./views/D3/d3.v3.min.js")
    this.width = "599";
    this.height = "535";
    this.attackerColor = "#f52549";
    this.attackerColorFixed = "crimson";
    this.victimColor = "#08e8de";
    this.victimColorFixed = "dodgerblue"
    this.nodesRadius = 15;
    this.nodeHoverColor = "springgreen";
    this.selectedColor = "gold";

    this.connectionCreateEnabled = false;
    this.connectionDeleteEnabled = true;
    this.zoomAndPanEnabled = true;

    this.svg = 0;
    this.force = 0;
    this.drag = 0;
    this.link = 0;
    this.node = 0;
    this.selectedJSON = 0;
    this.graphJSON = 0;
    this.nodesNamesIDs = {}

    this.groupingsByNetMask = {}

    // use for machine info panel
    this.onSelectedNodeChangedCallback = 0
    this.date = new Date()

    /**
     * @function setOnSelectedNodeChangedCallback
     * @description Set function used to notify other panels when a different node is selected, function will be passed the machine's name.
     * @param callbackFunction Callback function.
     */
    this.setOnSelectedNodeChangedCallback = function(callbackFunction){
        if(callbackFunction != null){
            this.onSelectedNodeChangedCallback = callbackFunction
        }
    }


    /**
     * @function onScenarioChanged
     * @description Callback function for other objects to update graph whenever the scenario object changes. 
     * @param {Scenario} modifiedScenarioJSON Scenario object to use for update.
     */
    this.onScenarioChanged = function(modifiedScenarioJSON){
        this.graphJSON = this.getGraphJSONFromScenario(modifiedScenarioJSON)
        this.graphJSONString = JSON.stringify(this.graphJSON);
        this.startGraph()
    }

    /**
     * @function getGraphJSONFromScenario
     * @description Takes a senario object and returns a graphJSON object based on IP/24 masks
     * @param {Scenario} scenarioObject Scenario object to use.
     */
    this.getGraphJSONFromScenario = function(scenarioObject){

        this.groupingsByNetMask = {}

        var machines = scenarioObject.getAllMachines()

        //check that machines have unique names
        var names = {}
        for(var i = 0; i<machines.length; i++){
            names[machines[i].getName()] = 0
        }
        for(var i = 0; i<machines.length; i++){
            names[machines[i].getName()] += 1
            if(names[machines[i].getName()] > 1){
                showToast("Duplicate Machine Names", "This scenario contains machines with duplicate names, can't show graph.")
                return
            }
        }

        var JSONObj = {"nodes":[], "links":[]}

        //create nodes
        var nameIndex = {}
        var machinePlaceholder = 0
        for(var i = 0; i<machines.length; i++){
            this.nodesNamesIDs[machines[i].getName()] = machines[i].getName() + "_" + generateUniqueId()
            machinePlaceholder = {
                "name":this.nodesNamesIDs[machines[i].getName()], 
                "type": machines[i].getIsAttacker() ? "attacker" : "victim", 
                "x": 442, 
                "y": 365,
                "ip":machines[i].networkSettings.getIpAddress()
            }
            JSONObj["nodes"].push(machinePlaceholder)
            nameIndex[this.nodesNamesIDs[machines[i].getName()]] = i
        }

        //This implementation is net mask /24 hardcoded, in future must support any netmasks.
        this.groupingsByNetMask = {}
        for(var i = 0; i<machines.length; i++){
            var ip = machines[i].networkSettings.getIpAddress().split(".")
            var netMask24 = ip[0] + "." + ip[1] + "." + ip[2]
            this.groupingsByNetMask[netMask24] = []
        }

        for(var i = 0; i<machines.length; i++){
            var ip = machines[i].networkSettings.getIpAddress().split(".")
            var netMask24 = ip[0] + "." + ip[1] + "." + ip[2]
            this.groupingsByNetMask[netMask24].push(machines[i])
        }

        //but triple nested loop is because 'document.getElementById()' doesnt work
        var pairings = []
        var netMasks = Object.keys(this.groupingsByNetMask)
        for(var i = 0; i<netMasks.length; i++){
            var netMachines = this.groupingsByNetMask[netMasks[i]]
            for(var j = 0; j<netMachines.length; j++){
                for(var k = 0; k<netMachines.length; k++){
                    if(j != k){
                        var pair = [this.nodesNamesIDs[netMachines[j].getName()], this.nodesNamesIDs[netMachines[k].getName()]].sort()
                        if(pairings.indexOf(pair.join()) < 0){
                            pairings.push(pair.join())
                            JSONObj["links"].push({
                                "source": nameIndex[pair[0]],
                                "target": nameIndex[pair[1]],
                                "sName": pair[0],
                                "tName": pair[1],
                                "netMask": netMasks[i]
                            })
                        }
                    }
                }
            }
        }
        return JSONObj
    }

    this.graphJSONString = JSON.stringify(this.getGraphJSONFromScenario(this.scenario));

    /**
     * @function updateScenarioFromJSONGraph
     * @description Takes a graph encoded as JSON and updates the scenario object.
     * @param {JSON} graphJSON JSON object to use.
     */
    this.updateScenarioFromJSONGraph = function(graphJSON){

        //TODO populate scenario maintaining the IP Addresses and netmasks of existing machines
        //and correctly generate new IP addresses for new nodes based on linkage. 
        //this function must be called whenever a node is added or a link is deleted/created
        var machine = 0
        for(var i = 0; i<this.graphJSON["nodes"].length; i++){
            machine = this.scenario.getMachineByName(this.getKeyByValue(this.nodesNamesIDs, this.graphJSON["nodes"][i]["name"]))
            if(machine != undefined && machine != null){
                machine.setName(this.getKeyByValue(this.nodesNamesIDs, this.graphJSON["nodes"][i]["name"]))
                machine.setIsAttacker(this.graphJSON["nodes"][i]["type"] == "attacker" ? true : false)
                machine.networkSettings.setIpAddress(this.graphJSON["nodes"][i]["ip"])
            }else{
                machine = this.scenario.createNewMachine(this.getKeyByValue(this.nodesNamesIDs, this.graphJSON["nodes"][i]["name"]))
                machine.setIsAttacker(this.graphJSON["nodes"][i]["type"] == "attacker" ? true : false)
                machine.networkSettings.setIpAddress(this.graphJSON["nodes"][i]["ip"])
            }
        }
    }


    this.getKeyByValue = function(dict, value){
        return Object.keys(dict).find(key => dict[key] === value)
    }


    /**
     * @function getAvailableIpByNetMask
     * @description Returns an available slot within the ip netmask, based on the current groupings. returns "" if no addresses are available.
     * @param {String} netMask Network section of the ip address, to be compared against existing netmask groupings.
     */
    this.getAvailableIpByNetMask = function(netMask){
        var ip = netMask
        var octets = netMask.split(".")
        if(this.groupingsByNetMask[netMask] != undefined && this.groupingsByNetMask[netMask] != null){
            var nodesInNet = this.groupingsByNetMask[netMask]
            ip = this.getNextAvailableIP(netMask, nodesInNet, 4 - octets.length)
        }else{
            
            if(octets.length > 0 && octets.length < 4){
                for(var i = octets.length; i<4; i++){
                   ip += "." + 1 
                   
                }
            }else{
                return ""
            }
        }
        return ip
    }

    this.getNextAvailableIP = function(netMask, addressList, slots){
        
        
        var counters = []
        for(var i = 0; i<slots;i++){
            counters.push(1)
        }
        var i = counters.length - 1
        
        while(i > -1){
            
            if(addressList.indexOf(netMask + "." + counters.join(".")) < 0){
                return netMask + "." + counters.join(".")
            }else{
                
                counters[i] += 1
                counters[i] %= 256
                if(counters[i] == 0){
                    i = i - 1
                }else{
                    i = counters.length - 1
                }
            }
        }
        return ""
    }

    /**
     * @function setConnectionDeleteOnClick
     * @description Sets the ability to delete connections by clicking on them.
     * @param {Boolean} exp Boolean value.
     */
    this.setConnectionDeleteOnClick = function(exp){

        if(exp != true && exp != false){
            return
        }
        this.connectionDeleteEnabled = exp
    }

    /**
     * @function redrawGraph
     * @description Redraws the graph encoded as a graphJSON, may be used for repositioning also.
     * @param {JSON} graphJSON JSON object to use.
     */
    this.redrawGraph = function(graphJSON){

        this.graphJSON = graphJSON

        var children = this.parentNode.children
        if(children.length > 0){
            //only remove the svg, keep everything else in order.
            for(var i = 0; i<children.length; i++){
                if(children[i].id == "graphSVG"){
                    this.parentNode.removeChild(children[i])
                }
            }
        }

        this.svg = this.d3.select(this.parentNode).append("svg").attr("id", "graphSVG")
        
        this.svg.attr("class", "netGraph");

        for(var i = 0; i<this.graphJSON.nodes.length; i++){
            this.graphJSON.nodes[i]["selected"] = "false";
        }

        //deselect any selected node
        if(this.selectedJSON != 0){
            this.selectedJSON.selected = "false";
            this.selectedJSON = 0;
        }
        

        //Instantiate a force object which will encompass the same size as the svg.
        this.force = this.d3.layout.force();
        this.force.size([this.width, this.height]);
        this.force.charge(-400);
        this.force.linkDistance(80);
        this.force.on("tick", this.tick.bind(this));

        //Instantiate a drag object and set the callback function 'dragstart'.
        this.drag = this.force.drag();
        this.drag.on("dragstart", this.dragstart.bind(this));

        this.resetGraphData();
        this.enableZoomAndPan(this.svg);

    }


    /**
     * @function enableZoomAndPan
     * @description Enables zoom and pan on the svg element.
     * @param svgElement DOM svg element.
     */
    this.enableZoomAndPan = function(svgElement){
        svgElement.call(
            this.d3.behavior.zoom().on("zoom", this.zoomAndPanHandler.bind(this))
        ).append("g");
    }

    /**
     * @function zoomAndPanHandler
     * @description Handles zoom and pan events, translating graph accordingly.
     * 
     */
    this.zoomAndPanHandler = function(){
        if(this.zoomAndPanEnabled){
            this.link.attr("transform", "translate(" + this.d3.event.translate + ")" + " scale(" + this.d3.event.scale + ")")
            this.node.attr("transform", "translate(" + this.d3.event.translate + ")" + " scale(" + this.d3.event.scale + ")")
        }
    }

    /**
     * @function resetGraphData
     * @description updates the graph based on the changes in the model, without redrawing.
     * 
     */
    this.resetGraphData = function(){

        //Set the global link object to point to all the 'link' class elements inside the svg.
        this.link = this.svg.selectAll(".link");//line svg elements
        this.node = this.svg.selectAll(".node");//circle svg elements

        //pass the node elements to the force object.
        this.force.nodes(this.graphJSON.nodes);

        //pass the link elements to the force object.
        this.force.links(this.graphJSON.links);

        this.force.start();

        //create the link objects and set thier common behavior.
        this.link = this.link.data(this.graphJSON.links);

        this.link.enter().append("line");
        this.link.attr("class", "link");
        this.link.attr("id", (d) => {
            return d.source.name + "_to_" + d.target.name;
        })
        this.link.attr("stroke", "#f8f9fa");
        this.link.attr("stroke-width", "6");
        this.link.on("click", this.deleteConnection.bind(this));


        //create the node objects and set their common behavior.
        this.node = this.node.data(this.graphJSON.nodes);

        this.node.enter().append("circle");
        this.node.attr("class", "node");
        this.node.attr("id", (d) => {return d.name;});
        this.node.attr("r", this.nodesRadius);
        this.node.attr("stroke-width", "4");
        this.node.attr("stroke", this.VMColor.bind(this));
        this.node.attr("fill", this.VMColor.bind(this));
        this.node.on("mouseover", this.handleMouseOver.bind(this));
        this.node.on("mouseout", this.handleMouseOut.bind(this));
        this.node.on("dblclick", this.dblclick.bind(this));
        this.node.on("click", this.selectAndConnect.bind(this));
        this.node.call(this.drag);
    }

    
    /**
     * @function VMColor
     * @description Returns the color of the node fill, based on the state of the nodeJSON.
     * @param d nodeJSON object.
     */
    this.VMColor = function(d){
        if(d.type == "attacker"){
            if(d.fixed){
                return this.attackerColorFixed;
            }else{
                return this.attackerColor;
            }
        }
        
        if(d.fixed){
            return this.victimColorFixed;
        }else{
            return this.victimColor;
        }
    }

    /**
     * @function strokeColor
     * @description Returns the color of the node border, based on the state of the nodeJSON.
     * @param d nodeJSON object.
     */
    this.strokeColor = function(d){
        if(d.selected == "true"){
            return this.selectedColor;
        }else{
            return this.nodeHoverColor;
        }
    }

    //PHYSICS CALLBACK FUNCTIONS///////////////////////////////////////////////

    /**
     * @function handleMouseOver
     * @description Handles the node's 'mouseover' events.
     * @param d nodeJSON object.
     */
    this.handleMouseOver = function(d) {
        
        this.zoomAndPanEnabled = false;
        if(d.selected == "false"){
            // Use D3 to select element, change color and size
            this.d3.select("#" + d.name).attr({
            fill: this.VMColor(d),
            r: this.nodesRadius * 1.2,
            stroke: this.strokeColor(d)
            });
        }
        
        this.svg.append("text").attr({
        fill:"white",
        id: "t" + d.name,  // Create an id for text so we can select it later for removing on mouseout
            x: function() {return d.x - 70; },
            y: function() {return d.y - 15; },
        })
        .text(function() {
        return d.name.split("_")[0];  // Value of the text
        });
    }

    /**
     * @function handleMouseOut
     * @description Handles the node's 'mouseout' events.
     * @param d nodeJSON object.
     */
    this.handleMouseOut = function(d) {

        this.zoomAndPanEnabled = true;
        if(d.selected == "false"){
            // Use D3 to select element, change color back to normal
            this.d3.select("#" + d.name).attr({
            fill: this.VMColor(d),
            r: this.nodesRadius,
            stroke: this.VMColor(d)
            });
        }

        // Select text by id and then remove
        this.d3.select("#t" + d.name).remove();  
    }

    /**
     * @function tick
     * @description Callback function used by d3 for updating positions with respect to time.
     *
     */
    this.tick = function() {

        this.link.attr("x1", function(d) { return d.source.x; })
        this.link.attr("y1", function(d) { return d.source.y; })
        this.link.attr("x2", function(d) { return d.target.x; })
        this.link.attr("y2", function(d) { return d.target.y; });

        this.node.attr("cx", this.updateX.bind(this));
        this.node.attr("cy", this.updateY.bind(this));
    }


    this.updateX = function(d){
        this.d3.select("#t" + d.name).attr("x", d.x - 70);
        return d.x; 
    }


    this.updateY = function(d){
        this.d3.select("#t" + d.name).attr("y", d.y - 15);
        return d.y; 
    }


    /**
     * @function dblclick
     * @description Handles 'dblclick' events on nodes, unfixes them.
     * @param d nodeJSON object.
     */
    this.dblclick = function(d) {
        
        d.fixed = false
        var elem = document.getElementById(d.name)
        elem.setAttribute("fixed", d.fixed)
        elem.setAttribute("fill", this.VMColor(d))
    }

    /**
     * @function dragstart
     * @description Handles 'dragstart' events on nodes, fixes them.
     * @param d nodeJSON object.
     */
    this.dragstart = function(d) {

        d.fixed = true
        var elem = document.getElementById(d.name)
        elem.setAttribute("fixed", d.fixed)
        elem.setAttribute("fill", this.VMColor(d))
    }

    /**
     * @function deleteConnection
     * @description Removes link from DOM and graphJSON.
     * @param d linkJSON object.
     */
    this.deleteConnection = function(d){
        if(this.connectionDeleteEnabled){
            //search for link in graph and delete
            var index = -1;
            for(var i = 0; i<this.graphJSON.links.length; i++){
                if((this.graphJSON.links[i].source.name == d.source.name)&&(this.graphJSON.links[i].target.name == d.target.name)){
                    var index = i;
                }
            }

            if(index >= 0){
                this.graphJSON.links.splice(index, 1);
                this.d3.select("#" + d.sName + "_to_" + d.tName).remove()
                this.updateJSONString(this.graphJSON);
                this.resetGraphData()
                this.selectedJSON = 0;
            }else{
                console.log("Element does not exist");
            }
        }else{
            showToast("Delete Connection", "Implemented but disabled")
        }

        this.updateScenarioFromJSONGraph(this.graphJSON)
    }

    /**
     * @function deleteNode
     * @description Removes node from DOM and graphJSON.
     * @param d nodeJSON object.
     */
    this.deleteNode = function(nodeName){
        //i hate this function, its ugly, 'document.getElementById()' doesn't work on svg elements, thats why

        //find node with id
        var children = this.parentNode.children
        var svgElem = 0
        
        for(var i = 0; i<children.length; i++){
            if(children[i].id == "graphSVG"){
                svgElem = children[i]
            }
        }
        
        var elem = 0
        if(svgElem != 0){
            children = svgElem.children
            for(var i = 0; i<children.length; i++){
                if(children[i].id == nodeName){
                    elem = children[i]
                    this.d3.select(elem).remove()
                }
            }

            if(elem != 0){
                for(var i = 0; i<this.graphJSON.nodes.length; i++){
                    if(this.graphJSON.nodes[i].name == elem.id){
                        this.graphJSON.nodes.splice(i, 1)
                    }
                }
            }


            //remove all link
            var linksToRemove = []
            for(var i = 0; i<this.graphJSON.links.length; i++){
                if((this.graphJSON.links[i].sName == nodeName) || (this.graphJSON.links[i].tName == nodeName)){
                    linksToRemove.push(this.graphJSON.links[i])
                }
            }

            for(var i = 0; i<linksToRemove.length; i++){
                this.deleteConnection(linksToRemove[i])
            }
        }
        this.updateScenarioFromJSONGraph(this.graphJSON)
    }

    /**
     * @function selectAndConnect
     * @description Handles 'click' events on nodes, if 'connect' is enabled, adds new link to DOM and graphJSON.
     * @param d nodeJSON object.
     */
    this.selectAndConnect = function(d){

        //TODO: handle when slectedJSON is null, at start of graph
        if(this.selectedJSON != 0){
            if(this.selectedJSON != d){
                this.selectedJSON.selected = "false";
                this.d3.select("#" + this.selectedJSON.name)
                .attr("stroke", this.VMColor(this.selectedJSON))
                .attr("r", this.nodesRadius);

                if(this.connectionCreateEnabled){
                    //links are bididerctional for now
                    if((this.d3.select("#" + this.selectedJSON.name + "_to_" + d.name)[0][0] == null) && (this.d3.select("#" + d.name + "_to_" + this.selectedJSON.name)[0][0] == null)){
                        this.connectNodes(this.selectedJSON, d)
                    }
                }
            }
        }


        //trigger callback
        if(this.onSelectedNodeChangedCallback != 0){
            var machineFromScenario = this.scenario.getMachineByName(this.getKeyByValue(this.nodesNamesIDs, d.name))
            if(machineFromScenario!= undefined || machineFromScenario != null){
                this.onSelectedNodeChangedCallback(machineFromScenario)
            }else{
                showToast("Box not in scenario", "The box does not exist in scenario object")
            }
        }
        d.selected = "true";
        this.d3.select("#" + d.name).attr("stroke", this.strokeColor(d))
        this.d3.select("#" + d.name).attr("fill", this.VMColor(d))
        this.selectedJSON = d;
    }


    /**
     * @function connectNodes
     * @description Creates connection between two nodes and updates the graph.
     * @param {String} sourceJSON source machine's JSON object.
     * @param {String} destJSON destination machine's JSON object.
     */
    this.connectNodes = function(sourceJSON, destJSON){
        newLink = {"source":sourceJSON, "target":destJSON, "sName":sourceJSON.name, "tName":destJSON.name, }
        this.graphJSON.links.push(newLink);
        this.updateJSONString(this.graphJSON);
        this.svg.selectAll("*").remove();
        this.resetGraphData();

        this.updateScenarioFromJSONGraph(this.graphJSON)
    }

    
    /**
     * @function connectToAll
     * @description Creates connections from the current node to all the axisting nodes in the graph.
     * @param {String} nodeJSON JSON object to connect to all.
     */
    this.connectToAll = function(nodeJSON){

        if(this.graphJSON["nodes"].length > 1){
            for(var i = 0; i<this.graphJSON["nodes"].length; i++){
                if(this.graphJSON["nodes"][i] != nodeJSON){
                    this.connectNodes(nodeJSON, this.graphJSON["nodes"][i])
                }
            }
        }else{
            if(this.graphJSON["nodes"].length != 0){
                this.svg.selectAll("*").remove();
                this.resetGraphData();
                this.updateScenarioFromJSONGraph(this.graphJSON)
            }
        }
    }


    /**
     * @function addNewNode
     * @description Adds new node to DOM and graphJSON, the node created has the name and type provided.
     * @param {String} machineName name of machine.
     * @param {String} machineType either 'victim' or 'attacker'.
     */
    this.addNewNode = function(machineName, machineType){

        if(this.nodesNamesIDs[machineName] != null && this.nodesNamesIDs[machineName] != undefined){
            machineName = machineName + generateUniqueId()
        }

        this.nodesNamesIDs[machineName] = machineName + "_" + generateUniqueId()
        //Clone an element from the graph.
        newNode = {
            "name":this.nodesNamesIDs[machineName],
            "type":machineType, 
            "x":0, 
            "y":0, 
            "px":0, 
            "py":0, 
            "fixed":0,
            "selected":"false",
            "ip":this.getAvailableIpByNetMask("192.168.50")//must guard for case where no ip is available
            }

        this.graphJSON["nodes"].push(newNode);
        // this.updateJSONString(this.graphJSON);
        // this.resetGraphData();
        
        //temporary workaround, uncomment code above once netmasks are implemented//////////////////////////////////////////////////////////
        this.connectToAll(newNode)

        //update the scenario object
        this.updateScenarioFromJSONGraph(this.graphJSON)
    }

    /**
     * @function updateJSONString
     * @description Updates the relevant fields of JSON string encoding of the graph. 
     * @param graphJSONObject graphJSON object.
     */    
    this.updateJSONString = function(graphJSONObject){////////////////////////////////////////////////////////////////////////
        updatedModelObject = {"nodes":[], "links":[]};
        
        var currentNodes = graphJSONObject["nodes"];
        for(var i = 0; i<currentNodes.length; i++){
            var newNode = {
                "name": currentNodes[i]["name"],
                "x": currentNodes[i]["x"],
                "y": currentNodes[i]["y"],
                "type": currentNodes[i]["type"]
            }
            updatedModelObject["nodes"].push(newNode);
        }

        var currentLinks = graphJSONObject["links"];
        for(var i = 0; i<currentLinks.length; i++){
            var newLink = {
                "source":currentLinks[i]["source"]["index"],
                "target":currentLinks[i]["target"]["index"],
                "sName":currentLinks[i]["source"]["name"],
                "tName":currentLinks[i]["target"]["name"],
                "netMask":currentLinks[i]["netMask"]
            }
            updatedModelObject["links"].push(newLink);
        }
        this.graphJSONString = JSON.stringify(updatedModelObject);
    }

    /**
     * @function getJSONStringGraph
     * @description Returns a string JSON with the current state of graphJSON. 
     * 
     */ 
    this.getJSONStringGraph = function(){
        console.log(this.graphJSONString)
        return this.graphJSONString
    }      

    /**
     * @function addFloatingFooterButtons
     * @description Draws footer floating buttons. 
     * @param footerButtonsNamesAndHandlers dictionary containing label=>handler pairs.
     */ 
    this.addFloatingFooterButtons = function(footerButtonsNamesAndHandlers){
        var buttonsContainer = document.createElement("div")
        buttonsContainer.className = "netGraphToolbar"
        
        var keys = Object.keys(footerButtonsNamesAndHandlers)
    
        for(var i=0; i<keys.length; i++){
            var placeholderButton = document.createElement("button")
            placeholderButton.setAttribute("type", "button")
            placeholderButton.className = String(keys[i]).split("_")[0] + "-button btn btn-sm btn-" + String(keys[i]).split("_")[1]
            placeholderButton.innerHTML = String(keys[i]).split("_")[0]
            placeholderButton.style = "margin: 2px"
            placeholderButton.addEventListener("click", footerButtonsNamesAndHandlers[keys[i]])
            buttonsContainer.appendChild(placeholderButton)
        }
        this.parentNode.appendChild(buttonsContainer)
    }

    /**
     * @function toggleConnect
     * @description Toggles the ability to create links. 
     * 
     */ 
    this.toggleConnect = function(){
        this.connectionCreateEnabled = !this.connectionCreateEnabled;
        
        var toggleButton = document.getElementById("toggleConnectButton")
        if(!this.connectionCreateEnabled){
            toggleButton.className = "toggleConnectButton button btn btn-light"
            toggleButton.innerHTML = "Linking Off"
        }else{
            toggleButton.className = "toggleConnectButton button btn btn-success"
            toggleButton.innerHTML = "Linking On"
        }
    }

    /**
     * @function drawGraphOptionButtons
     * @description Draws the re-center and link-enable-toggle buttons. 
     * 
     */ 
    this.drawGraphOptionButtons = function(){
        //toggle-connect button
        var toggleConnectButton = document.createElement("button")
        toggleConnectButton.setAttribute("type", "button")
        toggleConnectButton.className = "toggleConnectButton button btn btn-light"
        toggleConnectButton.id = "toggleConnectButton"
        toggleConnectButton.innerHTML = "Manual Linking: Off"
        toggleConnectButton.style = "position:absolute; top: 20px; left:20px; z-index:1"
        toggleConnectButton.addEventListener("click", function(){showToast("Toggle link Creation", "Implemented but disabled")})
        // toggleConnectButton.addEventListener("click", this.toggleConnect.bind(this))
        this.parentNode.appendChild(toggleConnectButton)

        //reposition button
        var repositionButton = document.createElement("button")
        repositionButton.setAttribute("type", "button")
        repositionButton.className = "repositionButton button btn btn-outline-light"
        repositionButton.id = "repositionButton"
        repositionButton.innerHTML = "Re-center"
        repositionButton.style = "position:absolute; top: 60px; left:20px; z-index:1"
        repositionButton.addEventListener("click", this.startGraph.bind(this))
        this.parentNode.appendChild(repositionButton)
    }


    /**
     * @function startGraph
     * @description Draws the graph stored as graphJSON. 
     * 
     */ 
    this.startGraph = function(){
        test = JSON.parse(this.graphJSONString)
        this.redrawGraph(test)
    }
}



