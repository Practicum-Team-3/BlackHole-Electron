# Widow
Experimental back-end communication handlers and data abstractions.

To adopt the usage of experimental widow in an html document add:

    <script src="../../../Electron/widow/scenarios.js"></script>

## Access

Access to the widow environment is persistent across views and generated automatically. To access the widow envoronment the following on a js script:

    widow.*

To access available scenarios:

    widow.scenarios.getScenarioNamesList()
    
To access a specific scenario:
    
    widow.scenarios.getScenarioByName()
    
To get all scenarios:

    widow.scenarios.getAllScenarios()
    
To add a new scenario: (returns instance of new scenario)

    widow.scenarios.newScenario()
    
To trigger the saving of a scenario to the back-end: (pass name of scenario to save)

    widow.scenarios.saveScenarioByName()
    
## Single scenario
Properties of a single scenario can be modified as such:
    
    scenarioInstance.setName()
    scenarioInstance.getName()
    scenarioInstance.getMachineNamesList()