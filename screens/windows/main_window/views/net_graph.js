
// function NetGraph(scenJSON, parent){

//     var scenario = scenJSON
//     var parentNode = parent

var width = "599";
var height = "535";
var attackerColor = "#f52549";
var attackerColorFixed = "crimson";
var victimColor = "#08e8de";
var victimColorFixed = "dodgerblue"
var nodesRadius = 15;
var nodeHoverColor = "springgreen";
var selectedColor = "gold";

var connectionCreateEnabled = false;
var zoomAndPanEnabled = true;

var svg = 0;
var force = 0;
var drag = 0;
var link = 0;
var node = 0;
var selectedJSON = 0;
var graph = 0;
var graphJSONString = 0

function redrawGraph(graphJSON, rootNode){

    graph = graphJSON

    svg = d3.select(rootNode).append("svg").attr("id", "graphSVG")

    //clear the svg children
    svg.selectAll("*").remove();

    svg.attr("width", width);
    svg.attr("height", height);

    for(var i = 0; i<graph.nodes.length; i++){
        graph.nodes[i]["selected"] = "false";
    }

    //deselect any selected node
    if(selectedJSON != 0){
        selectedJSON.selected = "false";
    }
    selectedJSON = 0;

    //Instantiate a force object which will encompass the same size as the svg.
    force = d3.layout.force();
    force.size([width, height]);
    force.charge(-400);
    force.linkDistance(80);
    force.on("tick", tick);

    //Instantiate a drag object and set the callback function 'dragstart'.
    drag = force.drag();
    drag.on("dragstart", dragstart);

    resetGraphData();
    enableZoomAndPan(svg);

}

function enableZoomAndPan(svgElement){
    svgElement.call(
        d3.behavior.zoom().on("zoom", function(){
            if(zoomAndPanEnabled){
                link.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
                node.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
                document.getElementById("textarea").innerHTML = "Pan: " + d3.event.translate + " | Zoom: " + d3.event.scale;
            }
        })
    ).append("g");
}

function resetGraphData(){

    //Set the global link object to point to all the 'link' class elements inside the svg.
    link = svg.selectAll(".link");//line svg elements
    node = svg.selectAll(".node");//circle svg elements

    //pass the node elements to the force object.
    force.nodes(graph.nodes);

    //pass the link elements to the force object.
    force.links(graph.links);

    force.start();

    //create the link objects and set thier common behavior.
    link = link.data(graph.links);

    link.enter().append("line");
    link.attr("class", "link");
    link.attr("id", (d) => {
        return d.source.name + "_to_" + d.target.name;
    })
    link.attr("stroke", "#f8f9fa");
    link.attr("stroke-width", "6");
    link.on("click", deleteConnection);


    //create the node objects and set their common behavior.
    node = node.data(graph.nodes);

    node.enter().append("circle");
    node.attr("class", "node");
    node.attr("id", (d) => {return d.name;});
    node.attr("r", nodesRadius);
    node.attr("stroke-width", "4");
    node.attr("stroke", VMColor);
    node.attr("fill", VMColor);
    node.on("mouseover", handleMouseOver);
    node.on("mouseout", handleMouseOut);
    node.on("dblclick", dblclick);
    node.on("click", selectAndConnect);
    node.call(drag);
}

function VMColor(d){
    if(d.type == "attacker"){
        if(d.fixed){
            return attackerColorFixed;
        }else{
            return attackerColor;
        }
    }

    if(d.fixed){
        return victimColorFixed;
    }else{
        return victimColor;
    }
}

function strokeColor(d){
    if(d.selected == "true"){
        return selectedColor;
    }else{
        return nodeHoverColor;
    }
}

//PHYSICS CALLBACK FUNCTIONS///////////////////////////////////////////////
function handleMouseOver(d) {
    
    zoomAndPanEnabled = false;
    if(d.selected == "false"){
        // Use D3 to select element, change color and size
        d3.select("#" + d.name).attr({
        fill: VMColor(d),
        r: nodesRadius * 1.2,
        stroke: strokeColor(d)
        });
    }

    svg.append("text").attr({
    fill:"white",
    id: "t" + d.name,  // Create an id for text so we can select it later for removing on mouseout
        x: function() { return d.x - 70; },
        y: function() { return d.y - 15; },
    })
    .text(function() {
    return d.name;  // Value of the text
    });
}

function handleMouseOut(d) {

    zoomAndPanEnabled = true;
    if(d.selected == "false"){
        // Use D3 to select element, change color back to normal
        d3.select("#" + d.name).attr({
        fill: VMColor(d),
        r: nodesRadius,
        stroke: VMColor(d)
        });
    }

    // Select text by id and then remove
    d3.select("#t" + d.name).remove();  // Remove text location
}

function tick() {
        
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", 
                    function(d) {
                        d3.select("#t" + d.name).attr("x", d.x - 70);
                        return d.x; 
                    });
    node.attr("cy", 
                    function(d) {
                        d3.select("#t" + d.name).attr("y", d.y - 15);
                        return d.y; 
                    });
}

function dblclick(d) {
    d3.select(this).classed("fixed", d.fixed = false);
    d3.select(this).attr("fill", VMColor)
}

function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed = true);
    d3.select(this).attr("fill", VMColor);
}

function deleteConnection(d){
    //search for link in graph and delete
    var index = -1;
    for(var i = 0; i<graph.links.length; i++){
        if((graph.links[i].source.name == d.source.name)&&(graph.links[i].target.name == d.target.name)){
            var index = i;
        }
    }

    if(index >= 0){
        graph.links.splice(index, 1);
        d3.select(this).remove()
        updateJSONModel(graph);
        resetGraphData()
        selectedJSON = 0;
    }else{
        console.log("Element does not exist");
    }
}

function selectAndConnect(d){

    //TODO: handle when slectedJSON is null, at start of graph
    if(selectedJSON != 0){
        if(selectedJSON != d){
            selectedJSON.selected = "false";
            d3.select("#" + selectedJSON.name)
            .attr("stroke", VMColor(selectedJSON))
            .attr("r", nodesRadius);

            if(connectionCreateEnabled){
                //links are bididerctional for now
                if((d3.select("#" + selectedJSON.name + "_to_" + d.name)[0][0] == null) && (d3.select("#" + d.name + "_to_" + selectedJSON.name)[0][0] == null)){
                    newLink = {"source":selectedJSON, "target":d}
                    graph.links.push(newLink);
                    updateJSONModel(graph);
                    svg.selectAll("*").remove();
                    resetGraphData();
                }
            }
        }
    }

    d.selected = "true";
    d3.select("#" + d.name).attr("stroke", strokeColor(d))
    selectedJSON = d;
}

function addNewNode(machineName, machineType){
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

    graph["nodes"].push(newNode);
    updateJSONModel(graph);
    resetGraphData();
}

function updateJSONModel(graphJSONObject){
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
    graphJSONString = JSON.stringify(updatedModelObject);
}

function getJSONStringGraph(){
    document.getElementById("textarea").innerHTML = graphJSONString;
}

function restartGraph(){
    graph = JSON.parse(graphJSONString);
    redrawGraph(graph);  
}

function toggleEnableConnect(){
    connectionCreateEnabled = !connectionCreateEnabled;
    button = document.getElementById("toggleConnectButton");
    if(connectionCreateEnabled){
        button.innerHTML = "Connect Enabled";
    }else{
        button.innerHTML = "Connect Disabled";
    }
}        


function testAddNew(){
    d = new Date();
    addNewNode("_" + d.getTime(), "_" + d.getTime())
}


function startGraph(scenario, netGraphNode){

    graphJSONString = `{
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
    test = JSON.parse(graphJSONString);
    redrawGraph(test, netGraphNode)
}


// }

//==================== floating buttons =======================
function addFloatingFooterButtons(netGraphNode, footerButtonsNamesAndHandlers){

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
    netGraphNode.appendChild(buttonsContainer)
}