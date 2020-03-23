

function OverviewsPanel(overviewsPanelNode){
    var self = this

    this.navTabNodesList = {}
    
    this.overviewsPanelNode = overviewsPanelNode
    this.overviewsPanelNode.className = this.overviewsPanelNode.className + " bg-secondary"
    this.overviewsPanelNode.style = "height:100%; width:25%; border:5px solid #b1b1b1; border-radius:10px"
    
    // this.overviewsPanelNode.appendChild(this.overviewsPanelTabsBar)
    //#ffc107
    //----------------------------------------------------------------


    //Create instance for MachineListOverview
    this.machineListNode = document.getElementById("machineListOverview")
    this.machineListNode.className = "machineListNode"
    this.machineListOverview = new MachineListOverview(this.machineListNode)
    // this.machineListOverview.setMachines()


    this.setWidth = function(percentWidth){
        this.overviewsPanelNode.style.flexGrow = percentWidth
    }
}