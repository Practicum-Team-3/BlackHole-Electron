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
      "scenario_id": "dTRN{P)C",
      "creation_date": "02/03/2020 21:22:38",
      "last_accessed": "02/03/2020 21:22:38",
      "exploit_info": {
        "name": "test_name",
        "type": "test_type",
        "download_link": "test_download_link"
      },
      "vulnerability_info": {
        "name": "test_name",
        "type": "test_type",
        "cve_link": "test_cve_link",
        "download_link": "test_download_link"
      },
      "machines": {
        "attacker": {
          "os": "laravel/homestead",
          "name": "attacker",
          "is_attacker": true,
          "shared_folders": [
            "./attackerfiles",
            "/sharedfolder"
          ],
          "network_settings": {
            "network_name": "Network Name",
            "network_type": "Network Type",
            "ip_address": "192.168.50.5",
            "auto_config": true
          },
          "provisions": {
            "name": "pingVictim",
            "provision_type": "shell",
            "commands": [
              "pip install unique-id"
            ]
          },
          "gui": false
        },"attacker1": {
          "os": "laravel/homestead",
          "name": "attacker1",
          "is_attacker": true,
          "shared_folders": [
            "./attackerfiles",
            "/sharedfolder"
          ],
          "network_settings": {
            "network_name": "Network Name",
            "network_type": "Network Type",
            "ip_address": "192.168.50.7",
            "auto_config": true
          },
          "provisions": {
            "name": "pingVictim",
            "provision_type": "shell",
            "commands": [
              "pip install unique-id"
            ]
          },
          "gui": false
        },
        "victim": {
          "os": "laravel/homestead",
          "name": "victim",
          "is_attacker": false,
          "shared_folders": [
            "./victimfiles",
            "/sharedfolder"
          ],
          "network_settings": {
            "network_name": "Network Name",
            "network_type": "Network Type",
            "ip_address": "192.168.50.6",
            "auto_config": true
          },
          "provisions": {
            "name": "pingVictim",
            "provision_type": "shell",
            "commands": [
              "pip install unique-id"
            ]
          },
          "gui": false
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