

function OverviewsPanel(overviewsPanelNode){
    var self = this

    this.navTabNodesList = {}
    
    this.overviewsPanelNode = overviewsPanelNode
    //this.overviewsPanelNode.className = this.overviewsPanelNode.className + " bg-secondary"
    //this.overviewsPanelNode.style = "border:5px solid #b1b1b1; border-radius:10px"
    
    // this.overviewsPanelNode.appendChild(this.overviewsPanelTabsBar)
    //#ffc107
    //----------------------------------------------------------------
    //Create instance for ScenariosListOverview

    console.log("populating scenarios list...")
    this.scenariosListNode = document.getElementById("scenarioListOverview")
    this.scenariosListNode.className = "scenariosListNode"
    this.scenariosListOverview = new ScenariosListOverview(this.scenariosListNode)
    this.scenariosListOverview.setScenarios(widow.scenarios)

    //Create instance for BoxesListOverview
    console.log("populating boxeslist...")
    this.boxesListNode = document.getElementById("boxesListOverview")
    this.boxesListNode.className = "boxesListNode"
    this.boxesListOverview = new BoxesListOverview(this.boxesListNode)

    // Create instance for ExploitListOverview
    this.exploitListNode = document.getElementById("exploitListOverview")
    this.exploitListNode.className = "exploitListNode"
    this.exploitListOverview = new ProgramListOverview(this.exploitListNode, programListOverviewTypes.EXPLOITS)
    //this.exploitListOverview.setExploits()

    // Create instance for ProgramListOverview
    this.programListNode = document.getElementById("programListOverview")
    this.programListNode.className = "programListNode"
    this.programListOverview = new ProgramListOverview(this.programListNode, programListOverviewTypes.VULNERABILITIES)
    //this.programListOverview.setPrograms()


    this.setWidth = function(percentWidth){
        this.overviewsPanelNode.style.flexGrow = percentWidth
    }
}