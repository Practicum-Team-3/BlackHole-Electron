from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/scenarios/all')
def getScenarios():
    return '''{"scenarios":["Scenario 1", "Scenario 2", "Scenario 3"]}'''

@app.route('/scenarios/<scenario_name>')
def getScenario(scenario_name):
    return '''
{
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
}'''

@app.route('/scenarios/edit/<scenario_name>', methods = ['POST'])
def editScenario(scenario_name):
    return "cox"#jsonify(scenario_manager.editScenario(scenario_name ,  request.get_json()))

@app.route('/scenarios/new/<scenario_name>')
def createScenario(scenario_name):
    return "cox"#jsonify(scenario_manager.createScenario(scenario_name))

@app.route('/boxes/all')
def getAvailableBoxes():
    return '''{
        "1": "bento/ubuntu-16.04",
        "2": "generic/alpine37",
        "3": "kalilinux/rolling",
        "4": "laravel/homestead",
        "5": "opentable/win-7-professional-amd64-nocm"
    }'''

@app.route('/vagrantFiles/<scenario_name>/all')
def createVagrantFiles(scenario_name):
    return "cox"#jsonify(vagrant_manager.createVagrantFiles(scenario_name))

if __name__=="__main__":
    app.run()