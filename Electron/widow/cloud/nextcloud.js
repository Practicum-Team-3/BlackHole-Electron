var DOMParser = require('xmldom').DOMParser;
/**
 * @class NextcloudManager
 * @version 0.2.0
 * @description Abstraction for Nextcloud WebDAV operations
 */
function NextcloudManager(widowSettings){
    var widowSettings = widowSettings
    
    function getCredentials(){
        return widowSettings.getCloudCredentials()
    }
    function getCloudAddress(){
        return widowSettings.getCloudAddress()
    }
    
    function genericRequest(config){
        return new Promise(function(resolve, reject){
            
            axiosBridged(config, function (response) {
                
                resolve(response)

            }.bind(this), function (error) {
                console.log("NextcloudManager generic request error:")
                console.log(error)
                reject(error)

            })
            
        }.bind(this))
    }
    
    this.download = function(filePath){
        return genericRequest({
            method: 'get',
            url: getCloudAddress()+encodeURI(filePath),
            auth: getCredentials()
        })
    }
    
    this.upload = function(buffer, filePath){
        return genericRequest({
            method: 'put',
            url: getCloudAddress()+encodeURI(filePath),
            auth: getCredentials(),
            data: buffer
        })
    }
    
    this.createFolder = function(folderName){
        return genericRequest({
            method: 'mkcol',
            url: getCloudAddress()+encodeURI(folderName),
            auth: getCredentials()
        })
    }
    
    this.delete = function(path){
        return genericRequest({
            method: 'delete',
            url: getCloudAddress()+encodeURI(path),
            auth: getCredentials()
        })
    }
    
    this.listFolder = function(folderPath){
        return new Promise(function(resolve, reject){
            
            axiosBridged({
                method: 'propfind',
                url: getCloudAddress()+folderPath,
                auth: getCredentials(),
                data: "<?xml version=\"1.0\"?>\
                    <d:propfind  xmlns:d=\"DAV:\" xmlns:oc=\"http://owncloud.org/ns\" xmlns:nc=\"http://nextcloud.org/ns\">\
                      <d:prop>\
                            <d:getlastmodified /><d:getcontentlength /><d:getetag /><d:getcontenttype /><d:resourcetype /><oc:size />\
                      </d:prop>\
                    </d:propfind>"
            }, function (response) {
                
                var parser = new DOMParser()
                
                var prop = parser.parseFromString(response.data, "text/xml");
                var multistatus = processMultistatus(prop.getElementsByTagName("d:multistatus")[0], folderPath)
                //var nct
                resolve(multistatus)

            }.bind(this), function (error) {
                // handle error
                console.log(error);
                reject()

            })
            
        }.bind(this))
    }
    
    function processMultistatus(multistatus, folderPath){
        // The processed multistatus, an array of file descriptors
        var processedMultistatus = []
        
        // Iterate over the children of the multistatus
        var i, response, summary
        for (i=0; i<multistatus.childNodes.length; i++){
            response = multistatus.childNodes[i]
            summary = {}
            
            //Get the name and properties of the item and put on summary
            summary.name = getNameFromResponse(response, folderPath)
            extractPropertiesFromResponseIntoObject(response, summary)
            
            // Add the item summary and add to processed multistatus
            processedMultistatus.push(summary)
        }
        return processedMultistatus
    }
    
    function getNameFromResponse(response, folderPath){
        // Get the tag for href
        var href = response.getElementsByTagName("d:href")[0]
        
        // Guard, and get the child of the href tag (where the actual data is)
        if (href==null){return}
        href = href.childNodes[0]
        
        // Guard, and get actual data
        if (href==null){return}
        href = href.data
        
        // Remove the absoluteness of the href to only leave the name
        var completePath = widowSettings.getCloudPath()+folderPath
        if (!completePath.endsWith("/")){
            completePath += "/"
        }
        if (href.indexOf(completePath)!=0){return}
        href = href.replace(completePath, "")
        return decodeURIComponent(href)
    }
    
    function extractPropertiesFromResponseIntoObject(response, summary){
        var propstats = response.getElementsByTagName("d:propstat")
        var i, j, propstat, prop, attributes, attribute, attributeChild, attributeData
        // Iterate through the "propstat" tags to extract properties
        for (i=0; i<propstats.length; i++){
            propstat = propstats[i]
            
            // Check the status of this propstat
            status = propstat.getElementsByTagName("d:status")[0]
            if (status==null || status.data=="HTTP/1.1 404 Not Found"){continue}
            
            // Go into the inner property holder
            prop = propstat.getElementsByTagName("d:prop")[0]
            if (prop==null){continue}
            
            // Iterate through the property tags (attributes) inside the property holder
            attributes = prop.childNodes
            for (j=0; j<attributes.length; j++){
                // Get the attribute
                attribute = attributes[j]
                if (attribute.childNodes.length==0){continue}
                
                // Extract the data from either .data or .localName
                attributeChild = attribute.childNodes[0]
                if (attributeChild.tagName!=null){
                    attributeData = attributeChild.localName
                }else{
                    attributeData = attributeChild.data
                }
                
                // Add attribute to summary object
                summary[attribute.localName] = attributeData
            }
        }
    }
}

module.exports.NextcloudManager = NextcloudManager