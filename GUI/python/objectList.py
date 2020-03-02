import sys
import json

#Example of existing scenarios - Object
class scenerios:
  def __init__(self, id, name, createdDate):
    self.id = id
    self.name = name
    self.createdDate = createdDate

#Json serialization
def obj_dict(obj):
    return obj.__dict__


# creating list        
list = []  

#Appending instances to list  
list.append( scenerios(1, "Scenario #001", "02/01/2020")) 
list.append( scenerios(2, "Scenario #002", "02/02/2020")) 
list.append( scenerios(3, "Scenario #003", "02/03/2020")) 
list.append( scenerios(4, "Scenario #004", "02/04/2020")) 
list.append( scenerios(5, "Scenario #005", "02/05/2020")) 
list.append( scenerios(6, "Scenario #006", "02/06/2020")) 
list.append( scenerios(7, "Scenario #007", "02/07/2020")) 
list.append( scenerios(8, "Scenario #007", "02/07/2020")) 

#Convert list to json
json_ = json.dumps(list, default=obj_dict)
print(json_)



#Example of existing virtual machines - Objects
class sceneriosvms:
  def __init__(self, id, idfk, vmName, os, type, exploit, vuln, collector, ip, port):
    self.id = id
    self.idfk = idfk
    self.vmName = vmName
    self.os = os
    self.type = type
    self.exploit = exploit
    self.vuln = vuln    
    self.collector = collector
    self.ip = ip
    self.port = port
