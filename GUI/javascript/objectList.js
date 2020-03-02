var path = require('path');
const ipc = require('electron').ipcRenderer;

var sys = require('sys');
var exec = require('child_process').exec;
var child;

const pathToPythonScript = path.join(__dirname, 'python/objectList.py');

function launchPython(evt) {
    

    if (evt.srcElement.id == "test") {
        var printjson = "";
        var nodeConsole = require('console');
        var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
        myConsole.log('\x1b[34m%s\x1b[0m', 'MY CODE -- PRINT BEFORE PYTHON EXEC FROM NODE.JS');

        // EXECUTION OF PYTHON

        //console.log(__dirname);
        child = exec("py " + pathToPythonScript, function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });

        //this is a listener for peers output
        child.stdout.on('data', function (data) {
            var nodeConsole = require('console');
            var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
            
            //document.getElementById("jsonDisplay").value = data.toString();
            console.log(data.toString());
            var obj = JSON.parse(data);

            for (var i = 0; i < obj.length; i++) {
                //var counter = obj[i];
                //console.log(obj[i].id);
                addItem(obj[i]);
                printjson = printjson + "Scenario ID: " + obj[i].id + " -- Scenario Name: " + obj[i].name + "\n";
            }
            //document.getElementById("jsonDisplay").value = "Scenario: " + obj.name + ", ScenarioID: " + obj.id;
            document.getElementById("jsonDisplay").value = printjson;

        });
    }
}

function addItem(data) {
    var ul = document.getElementById("dynamic-list");
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute('href', "#");
    a.appendChild(document.createTextNode(data.name));
    li.setAttribute('id', data.id);
    li.appendChild(a);
    ul.appendChild(li);
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("test").addEventListener("click", launchPython);
});

/*function launchPython(evt) {
    console.log("testttt");
    document.getElementById("fname").value = "La cague de nuevo";
}*/