

function OverviewsPanel(overviewsPanelNode){
    var self = this

    this.navTabNodesList = {}
    
    this.overviewsPanelNode = overviewsPanelNode
    this.overviewsPanelNode.style = "flex: 0 0 250px;"
    
    // this.overviewsPanelNode.appendChild(this.overviewsPanelTabsBar)

    //----------------------------------------------------------------


    //Create instance for ProgramListOverview


    //Create instance of MachineListOverview for testing
    this.machineListNode = document.createElement("div")
    this.machineListNode.className = "machineListNode"
    this.testPanel = new MachineListOverview(this.machineListNode)
    this.overviewsPanelNode.appendChild(this.machineListNode)


    this.setWidth = function(percentWidth){
        this.overviewsPanelNode.style.flexGrow = percentWidth
    }
}