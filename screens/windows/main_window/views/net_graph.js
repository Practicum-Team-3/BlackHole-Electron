
function NetGraph(scenJSON, parent){

    this.scenario = scenJSON
    this.parentNode = parent

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
    this.zoomAndPanEnabled = true;

    this.svg = 0;
    this.force = 0;
    this.drag = 0;
    this.link = 0;
    this.node = 0;
    this.selectedJSON = 0;
    this.graph = 0;
    this.graphJSONString = 0

    this.redrawGraph = function(graphJSON){

        this.graph = graphJSON

        this.svg = d3.select(this.parentNode).append("svg").attr("id", "graphSVG")

        //clear the svg children
        this.svg.selectAll("*").remove();

        this.svg.attr("width", this.width);
        this.svg.attr("height", this.height);

        for(var i = 0; i<this.graph.nodes.length; i++){
            this.graph.nodes[i]["selected"] = "false";
        }

        //deselect any selected node
        if(this.selectedJSON != 0){
            this.selectedJSON.selected = "false";
        }
        this.selectedJSON = 0;

        //Instantiate a force object which will encompass the same size as the svg.
        this.force = d3.layout.force();
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

    this.enableZoomAndPan = function(svgElement){
        svgElement.call(
            d3.behavior.zoom().on("zoom", this.zoomAndPanHandler.bind(this))
        ).append("g");
    }

    this.zoomAndPanHandler = function(){
        if(this.zoomAndPanEnabled){
            this.link.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
            this.node.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
        }
    }

    this.resetGraphData = function(){

        //Set the global link object to point to all the 'link' class elements inside the svg.
        this.link = this.svg.selectAll(".link");//line svg elements
        this.node = this.svg.selectAll(".node");//circle svg elements

        //pass the node elements to the force object.
        this.force.nodes(this.graph.nodes);

        //pass the link elements to the force object.
        this.force.links(this.graph.links);

        this.force.start();

        //create the link objects and set thier common behavior.
        this.link = this.link.data(this.graph.links);

        this.link.enter().append("line");
        this.link.attr("class", "link");
        this.link.attr("id", (d) => {
            return d.source.name + "_to_" + d.target.name;
        })
        this.link.attr("stroke", "#f8f9fa");
        this.link.attr("stroke-width", "6");
        this.link.on("click", this.deleteConnection.bind(this));


        //create the node objects and set their common behavior.
        this.node = this.node.data(this.graph.nodes);

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

    this.VMColor = function(d){
        if(d.type == "attacker"){
            if(d.fixed){
                return this.attackerColorFixed;
            }else{
                return this.attackerColor;
            }
        }
        // console.log(d.fixed)
        if(d.fixed){
            return this.victimColorFixed;
        }else{
            return this.victimColor;
        }
    }

    this.strokeColor = function(d){
        if(d.selected == "true"){
            return this.selectedColor;
        }else{
            return this.nodeHoverColor;
        }
    }

    //PHYSICS CALLBACK FUNCTIONS///////////////////////////////////////////////
    this.handleMouseOver = function(d) {
        
        this.zoomAndPanEnabled = false;
        if(d.selected == "false"){
            // Use D3 to select element, change color and size
            d3.select("#" + d.name).attr({
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
        return d.name;  // Value of the text
        });
    }

    this.handleMouseOut = function(d) {

        this.zoomAndPanEnabled = true;
        if(d.selected == "false"){
            // Use D3 to select element, change color back to normal
            d3.select("#" + d.name).attr({
            fill: this.VMColor(d),
            r: this.nodesRadius,
            stroke: this.VMColor(d)
            });
        }

        // Select text by id and then remove
        d3.select("#t" + d.name).remove();  
    }

    this.tick = function() {

        this.link.attr("x1", function(d) { return d.source.x; })
        this.link.attr("y1", function(d) { return d.source.y; })
        this.link.attr("x2", function(d) { return d.target.x; })
        this.link.attr("y2", function(d) { return d.target.y; });

        this.node.attr("cx", 
                        function(d) {
                            d3.select("#t" + d.name).attr("x", d.x - 70);
                            return d.x; 
                        });
        this.node.attr("cy", 
                        function(d) {
                            d3.select("#t" + d.name).attr("y", d.y - 15);
                            return d.y; 
                        });
    }

    this.dblclick = function(d) {
        
        d.fixed = false
        var elem = document.getElementById(d.name)
        elem.setAttribute("fixed", d.fixed)
        elem.setAttribute("fill", this.VMColor(d))
    }

    this.dragstart = function(d) {

        d.fixed = true
        var elem = document.getElementById(d.name)
        elem.setAttribute("fixed", d.fixed)
        elem.setAttribute("fill", this.VMColor(d))
    }

    this.deleteConnection = function(d){
        //search for link in graph and delete
        var index = -1;
        for(var i = 0; i<this.graph.links.length; i++){
            if((this.graph.links[i].source.name == d.source.name)&&(this.graph.links[i].target.name == d.target.name)){
                var index = i;
            }
        }

        if(index >= 0){
            
            this.graph.links.splice(index, 1);
            d3.select("#" + d.sName + "_to_" + d.tName).remove()
            this.updateJSONModel(this.graph);
            
            this.resetGraphData()
            this.selectedJSON = 0;
        }else{
            console.log("Element does not exist");
        }
    }

    this.selectAndConnect = function(d){
        //TODO: handle when slectedJSON is null, at start of graph
        if(this.selectedJSON != 0){
            if(this.selectedJSON != d){
                this.selectedJSON.selected = "false";
                d3.select("#" + this.selectedJSON.name)
                .attr("stroke", this.VMColor(this.selectedJSON))
                .attr("r", this.nodesRadius);

                if(this.connectionCreateEnabled){
                    //links are bididerctional for now
                    if((d3.select("#" + this.selectedJSON.name + "_to_" + d.name)[0][0] == null) && (d3.select("#" + d.name + "_to_" + this.selectedJSON.name)[0][0] == null)){
                        newLink = {"source":this.selectedJSON, "target":d, "sName":this.selectedJSON.name, "tName":d.name}
                        this.graph.links.push(newLink);
                        this.updateJSONModel(this.graph);
                        this.svg.selectAll("*").remove();
                        this.resetGraphData();
                    }
                }
            }
        }

        d.selected = "true";
        d3.select("#" + d.name).attr("stroke", this.strokeColor(d))
        d3.select("#" + d.name).attr("fill", this.VMColor(d))
        this.selectedJSON = d;
    }

    this.addNewNode = function(machineName, machineType){
        //Clone an element from the graph.
        newNode = {
            "name":machineName, 
            "type":machineType, 
            "x":0, 
            "y":0, 
            "px":0, 
            "py":0, 
            "fixed":0,
            "selected":false
            }

        this.graph["nodes"].push(newNode);
        this.updateJSONModel(this.graph);
        this.resetGraphData();
    }

    this.updateJSONModel = function(graphJSONObject){
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
                "tName":currentLinks[i]["target"]["name"]
            }
            updatedModelObject["links"].push(newLink);
        }
        this.graphJSONString = JSON.stringify(updatedModelObject);
    }

    this.getJSONStringGraph = function(){
        document.getElementById("textarea").innerHTML = this.graphJSONString;
    }

    this.restartGraph = function(){
        console.log("called")
        this.graph = JSON.parse(this.graphJSONString);
        this.redrawGraph(this.graph);  
    }       

    this.testAddNew = function(){
        d = new Date();
        this.addNewNode("_" + d.getTime(), "victim")
    }

    this.addFloatingFooterButtons = function(footerButtonsNamesAndHandlers){
        var buttonsContainer = document.createElement("div")
        buttonsContainer.style = "position:absolute; bottom:40px; left:390px; z-index:1"
        
        var keys = Object.keys(footerButtonsNamesAndHandlers)
    
        for(var i=0; i<keys.length; i++){
            var placeholderButton = document.createElement("button")
            placeholderButton.setAttribute("type", "button")
            placeholderButton.className = String(keys[i]).split("_")[0] + "-button btn btn-" + String(keys[i]).split("_")[1]
            placeholderButton.innerHTML = String(keys[i]).split("_")[0]
            placeholderButton.style = "margin:10px"
            placeholderButton.addEventListener("click", footerButtonsNamesAndHandlers[keys[i]])
            buttonsContainer.appendChild(placeholderButton)
        }
        this.parentNode.appendChild(buttonsContainer)
    }

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

    this.drawGraphOptionButtons = function(){
        //toggle-connect button
        var toggleConnectButton = document.createElement("button")
        toggleConnectButton.setAttribute("type", "button")
        toggleConnectButton.className = "toggleConnectButton button btn btn-light"
        toggleConnectButton.id = "toggleConnectButton"
        toggleConnectButton.innerHTML = "Linking Off"
        toggleConnectButton.style = "position:absolute; top: 150px; left:315px; z-index:1"
        toggleConnectButton.addEventListener("click", this.toggleConnect.bind(this))
        this.parentNode.appendChild(toggleConnectButton)

        // //reposition button
        // var repositionButton = document.createElement("button")
        // repositionButton.setAttribute("type", "button")
        // repositionButton.className = "repositionButton button btn btn-outline-light"
        // repositionButton.id = "repositionButton"
        // repositionButton.innerHTML = "Re-center"
        // repositionButton.style = "position:absolute; top: 200px; left:315px; z-index:1"
        // repositionButton.addEventListener("click", this.restartGraph.bind(this))
        // this.parentNode.appendChild(repositionButton)
    }

    this.startGraph = function(){

        //this graph should be generated from the scenario passed on constructor
        this.graphJSONString = `{
            "nodes": [
                {"name":"attacker1","type":"attacker", "x": 469, "y": 410},
                {"name":"victim1", "type":"victim", "x": 493, "y": 364},
                {"name":"victim2", "type":"victim", "x": 442, "y": 365}
            ],
            "links": [
                {"source":  0, "target":  1, "sName":"attacker1", "tName":"victim1"},
                {"source":  1, "target":  2, "sName":"victim1", "tName":"victim2"},
                {"source":  2, "target":  0, "sName":"victim2", "tName":"attacker1"}
            ]
        }`
        test = JSON.parse(this.graphJSONString)
        this.redrawGraph(test)
    }

}



