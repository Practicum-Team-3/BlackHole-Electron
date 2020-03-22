

function OverviewsPanel(overviewsPanelNode){
    var self = this

    this.navTabNodesList = {}
    
    this.overviewsPanelNode = overviewsPanelNode
    this.overviewsPanelNode.className = this.overviewsPanelNode.className + " bg-secondary"
    this.overviewsPanelNode.style = "height:100%; width:25%; border:5px solid #ffc107; border-radius:10px"
    
    // this.overviewsPanelNode.appendChild(this.overviewsPanelTabsBar)

    //----------------------------------------------------------------


    //Create instance for MachineListOverview
    this.machineListNode = document.getElementById("machineListOverview")
    this.machineListNode.className = "machineListNode"
    this.machineListOverview = new MachineListOverview(this.machineListNode)

    //this.machineListOverview.setMachines()

    // Create instance for ExploitListOverview
    this.exploitListNode = document.getElementById("exploitListOverview")
    this.exploitListNode.className = "exploitListNode"
    this.exploitListOverview = new ExploitListOverview(this.exploitListNode)
    //this.exploitListOverview.setExploits()

    // Create instance for ProgramListOverview
    this.programListNode = document.getElementById("programListOverview")
    this.programListNode.className = "programListNode"
    this.programListOverview = new ProgramListOverview(this.programListNode)
    //this.programListOverview.setPrograms()


    this.setWidth = function(percentWidth){
        this.overviewsPanelNode.style.flexGrow = percentWidth
    }
}