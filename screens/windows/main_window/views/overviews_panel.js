

function OverviewsPanel(overviewsPanelNode){
    var self = this

    this.navTabNodesList = {}
    
    this.overviewsPanelNode = overviewsPanelNode
    //this.overviewsPanelNode.className = this.overviewsPanelNode.className + " bg-secondary"
    //this.overviewsPanelNode.style = "border:5px solid #b1b1b1; border-radius:10px"
    
    // this.overviewsPanelNode.appendChild(this.overviewsPanelTabsBar)
    //#ffc107
    //----------------------------------------------------------------


    //Create instance for BoxesListOverview
    this.boxesListNode = document.getElementById("boxesListOverview")
    this.boxesListNode.className = "boxesListNode"
    this.boxesListOverview = new BoxesListOverview(this.boxesListNode)
    this.boxesListOverview.setBoxes(widow.boxes)

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