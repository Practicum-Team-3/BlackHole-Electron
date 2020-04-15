from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/upload/filelist')
def getFileList():
  return "cpx"

@app.route('/upload/deletefile/<file_name>')
def deleteFile(file_name):
  return "cox"

@app.route('/upload/uploadFile', methods=['GET','POST'])
def uploadFile():
    return "cox"

@app.route('/scenarios/newEmpty/<scenario_name>')
def createScenario(scenario_name):
    return "cox"

@app.route('/scenarios/all')
def getScenarios():
    return '''{
        "response": true,
        "code": 0,
        "status": "complete",
        "body": {
            "scenarios":["Scenario 1", "Scenario 2", "Scenario 3"]
        }
    }'''

@app.route('/scenarios/<scenario_name>')
def getScenario(scenario_name):
    return '''
{
    "response": true,
    "code": 0,
    "status": "complete",
    "body": {
        "scenario_name": "'''+scenario_name+'''",
        "description":"description",
        "scenario_id":"",
        "creation_date":"2020-04-15T07:59:15.872Z",
        "last_accessed":"2020-04-15T07:59:15.894Z",
        "exploit":{
            "name":"",
            "type":"",
            "download_link":""
        },
        "vulnerability":{
            "name":"",
            "type":"",
            "cve_link":"",
            "download_link":""
        },
        "machines":{
            "brian":{
                "name":"brian",
                "os":"",
                "base_memory":"512",
                "processors":"1",
                "is_attacker":false,
                "shared_folders":[],
                "network_settings":{
                    "network_name":"",
                    "network_type":"",
                    "ip_address":
                    "192.168.50.1",
                    "auto_config":true
                },
                "provisions":[],
                "programs":[],
                "gui":false,
                "sharedFolders":[]
            }
        }
    }
}'''

@app.route('/scenarios/edit', methods = ['POST'])
def editScenario():
    print(request.get_json())
    return "cox"#jsonify(scenario_manager.editScenario(scenario_name ,  request.get_json()))

@app.route('/scenarios/delete/<scenario_name>')
def deleteScenario(scenario_name):
    """
    Edits a current scenario with a JSON file
    :param scenario_name: String with the scenario name
    :return: True if the scenario has been successfully edited, otherwise False
    """
    return "jsonify(scenario_manager.deleteScenario(scenario_name))"
        
@app.route('/vagrant/boxes/all')
def getAvailableBoxes():
    return '''{
        "response": true,
        "code": 0,
        "status": "complete",
        "body": {
            "1": "bento/ubuntu-16.04",
            "2": "generic/alpine37",
            "3": "kalilinux/rolling",
            "4": "laravel/homestead",
            "5": "opentable/win-7-professional-amd64-nocm"
        }
    }'''

@app.route('/vagrant/<scenario_name>/all')
def createVagrantFiles(scenario_name):
    return "cox"#jsonify(vagrant_manager.createVagrantFiles(scenario_name))
        
@app.route('/vagrant/<scenario_name>/run')
def runVagrantUp(scenario_name):
  """
  Executes the vagrant up command for each machine in the scenario
  :param scenario_name: String with the scenario name
  :return: True if the vagrant up commands were successfully executed
  """
  return "kops"

@app.route('/vagrant/<scenario_name>/ping/<source>/<destination>')
def testPing(scenario_name, source, destination):
  """
  Tests network connectivity between two virtual machines
  :param scenario_name: String with the scenario name
  :param source: Source virtual machine
  :param destination: Destination virtual machine
  :return:
  """
  return "???"
        

if __name__=="__main__":
    
    app.run()