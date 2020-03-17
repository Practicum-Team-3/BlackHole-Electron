# Widow 0317220714
Back-end communication handlers and data abstractions.

To adopt the usage of widow in an html document add:

    <script src="../../../Electron/widow/scenarios.js"></script>
    
## Documentation
http://widow.repixen.com

## Access

Access to the widow environment is persistent across views and generated automatically. To access the widow envoronment, use the following on a js script:

    widow.*

To access available scenarios:

    widow.scenarios.getScenarioNamesList()
    
To access a specific scenario:
    
    widow.scenarios.getScenarioByName(name)
    
To get all scenarios:

    widow.scenarios.getAllScenarios()
    
To obtain available VM boxes

    widow.boxes.getBoxesList()