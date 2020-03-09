# Widow
Back-end communication handlers and data abstractions.

To adopt the usage of experimental widow in an html document add:

    <script src="../../../Electron/widow/scenarios.js"></script>
    
## Documentation
http://widow.repixen.com

## Access

Access to the widow environment is persistent across views and generated automatically. To access the widow envoronment the following on a js script:

    widow.*

To access available scenarios:

    widow.scenarios.getScenarioNamesList()
    
To access a specific scenario:
    
    widow.scenarios.getScenarioByName(name)
    
To get all scenarios:

    widow.scenarios.getAllScenarios()
