# Main Window
Dashboard and scenario editor

Accepts scenarioName url parameter for a scenario to be opened upon loading

## Architecture

main_window.html includes the hardcoded components and layout nodes to build on top of

interface.js includes the code to manage all of the window at a high level

/views has files for the classes that are encharged of building interfaces of specific types. These classes may make use of nodeCombos to add the needed elements

## nodeCombos

After instantiating, this object can add groups of prepackaged components ready to be used. References to individual components are also kept by the object on "nodes"
Obtain the "nodes" object by calling getNodes()
