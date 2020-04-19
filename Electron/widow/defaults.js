module.exports.scenarioDescriptor = '{\
    "scenario_name": "",\
    "description": "",\
    "scenario_id": "",\
    "creation_date": "",\
    "last_accessed": "",\
    "exploit": {\
        "name": "",\
        "type": "",\
        "download_link": ""\
    },\
    "vulnerability": {\
        "name": "",\
        "type": "",\
        "cve_link": "",\
        "download_link": ""\
    },\
    "machines": {}\
}'


module.exports.machineDescriptor = '{\
    "name": "",\
    "box": "",\
    "os": "",\
    "base_memory": "512",\
    "processors": "1",\
    "is_attacker": false,\
    "shared_folders": [],\
    "network_settings": {\
        "network_name": "",\
        "network_type": "",\
        "ip_address": "",\
        "auto_config": true\
    },\
    "provisions": [],\
    "programs": [],\
    "gui": false\
}'

// uploads
module.exports.programDescriptor = '{\
    "name": "linux",\
    "location": ""\
}'

module.exports.provisionDescriptor = '{\
    "name": "",\
    "provision_type": "",\
    "commands": []\
}'

module.exports.installedProgramDescriptor = '{\
    "name": "",\
    "location": ""\
}'