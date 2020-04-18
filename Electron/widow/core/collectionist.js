/**
 * @class Collectionist
 * @description Object that keeps a collection of descriptor modifiers with their descriptors
 *              The descriptor can be either an object or an array
 * @version 2.0.0
 * @param {object} descriptor Collection descriptor object
 */
function Collectionist(descriptor, _collectableClass){
    var CollectableClass = _collectableClass
    
    // Inherited members on super
    if (this.super==null){
        this.super = {}
    }
    
    /**
     * @function changeReference
     * @memberof Collectionist
     * @description Inherited on super.
     *                  Changes the way a collectable's descriptor is referenced on the collection descriptor
     *                  Only applicable is descriptor is non-blind.
     * @param {string} oldReference The string of the old reference
     * @param {string} newReference The string of the new reference
     * @throws {string} Unable to change reference
     */
    this.super.changeReference = function(oldReference, newReference){
        
        if (this.isBlindDescriptor || this.descriptor[newReference]!=undefined){
            throw "Unable to change reference"
        }
        
        this.descriptor[newReference] = this.descriptor[oldReference]
        delete this.descriptor[oldReference]
        
    }.bind(this)
    
    /**
     * @function setDescriptor
     * @description Inherited on super.
     *                  Called upon instantiation, this method sets up the collection
     *                  from the passed descriptor
     * @memberof Collectionist
     * @param {object} descriptor Collection descriptor object or array
     */
    this.super.setDescriptor = function(descriptor){
        this.descriptor = descriptor
        this.isBlindDescriptor = Array.isArray(descriptor)
        this.collection = []

        // Create InstalledMachine instance per machine from descriptor
        if (this.isBlindDescriptor){// Descriptor is an array
            
            this.descriptor.forEach(function(collectableDescriptor){
                this.collection.push(new CollectableClass(collectableDescriptor))
            }.bind(this))
            
        }else{// Descriptor is a name value pair (non-blind)
            
            for (collectableName in this.descriptor){
                this.collection.push(new CollectableClass(this.descriptor[collectableName], this.super.changeReference))
            }
            
        }
    }.bind(this)
    this.super.setDescriptor(descriptor)
    
    
    /**
     * @function getAll
     * @description Inherited on super.
     *                  Returns array with all of the items in the collection
     * @memberof Collectionist
     * @returns {Collectable[]} Array with Collectable objects
     */
    this.super.getAll = function(){
        var collectionCopy = []
        this.collection.forEach(function(collectable){
            collectionCopy.push(collectable)
        })
        return collectionCopy
    }.bind(this)
    
    /**
     * @function getNamesList
     * @description Inherited on super.
     *                  Returns array with the names of collectables in the collection
     * @memberof Collectionist
     * @returns {string[]} Array of collectable names
     */
    this.super.getNamesList = function(){
        var names = []
        this.collection.forEach(function(collectable){
            names.push(collectable.getName())
        })
        return names
    }.bind(this)
    
    /**
     * @function getCollectablesByName
     * @description Inherited on super.
     *                  Returns array with collectables that match a specific name
     * @param {string} name Name to search
     * @returns {Collectable[]} Array with collectable items with the specified name
     */
    this.super.getCollectablesByName = function(name){
        var matches = []
        this.collection.forEach(function(collectable){
            if (collectable.getName()==name){
                matches.push(collectable)
            }
        })
        return matches
    }.bind(this)
    
    /**
     * @function getCollectableByName
     * @description Inherited on super.
     *                  Returns first instance matching the speficied name. Useful for when not expecting duplicates,
     *                  like in a non-blind collection descriptor
     * @param {string} name Name to search
     * @returns {Collectable} Instance with the specified name
     */
    this.super.getCollectableByName = function(name){
        for (collectableIndex in this.collection){
            if (this.collection[collectableIndex].getName()==name){
                return this.collection[collectableIndex]
            }
        }
        return null
    }.bind(this)
    
    /**
     * @function getCollectablesByCharacteristic
     * @description Inherited on super.
     *                  Returns array of collectables that match the value
     *                  of a specific member in their descriptor
     * @param   {string} memberName Name of get method of descriptor call and match
     * @param   {Any} value      Value of member to check for equality
     * @returns {Collectable[]} Array with collectable items matching the characteristic
     */
    this.super.getCollectablesByCharacteristic = function(memberName, value){
        var matches = []
        this.collection.forEach(function(collectable){
            if (collectable[memberName]()==value){
                matches.push(collectable)
            }
        })
        return matches
    }.bind(this)

    /**
     * @function add
     * @description Inherited on super.
     *                  Adds a collectable to the descriptor and to collection. Colectable objects
     *                  already on the collection will be ignored. Collectable objects may be added even
     *                  if another item already has that name, unless allowNameDuplicates is passed false or descriptor is non-blind
     * @memberof Collectionist
     * @param {Collectable} collectable     Collectable object to add
     * @param {boolean} allowNameDuplicates     Pass false for the add operation to fail if another
     *                                      collectable exists with the same name
     * @returns {boolean} Success of the operation. Always returns true if duplicates are allowed
     */
    this.super.add = function(collectable, allowNameDuplicates=false){
        if (this.collection.includes(collectable) ||
            (!this.isBlindDescriptor || !allowNameDuplicates) && this.super.getCollectableByName(collectable.getName())!=null){
            console.log("NOt adding")
            return false
        }
        console.log("Adding: "+collectable.getName())
        // Add to descriptor (careful to check the type of descriptor to cater to it)
        if (this.isBlindDescriptor){
            this.descriptor.push(collectable.getDescriptor())
        }else{
            collectable.super.setChangeReferenceCallback(this.super.changeReference)
            this.descriptor[collectable.getName()] = collectable.getDescriptor()
        }
        // Add to collection
        this.collection.push(collectable)
        
        return true
    }.bind(this)
    
    /**
     * @function remove
     * @description Inherited on super.
     *                  Removes a collectable from the descriptor and the collection
     * @memberof Collectionist
     * @param {Collectable} collectable     Collectable object to remove
     * @returns {boolean} Success of the removal
     */
    this.super.remove = function(collectable){
        if (!this.collection.includes(collectable)){
            return false
        }
        // Remove from descriptor
        if (this.isBlindDescriptor){
            this.descriptor.splice(this.descriptor.indexOf(collectable.getDescriptor()), 1)
        }else{
            delete this.descriptor[collectable.getName()]
        }
        // Remove from collection
        this.collection.splice(this.collection.indexOf(collectable), 1)
        
        return true
    }.bind(this)
    
}

module.exports.Collectionist = Collectionist

//======================
//== COLLECTABLE
//======================
/**
 * @class Collectable
 * @version 1.0.0
 * @param {object} descriptor Descriptor (or portion) that collectable is to handle
 * @param {function} changeReferenceCallback Optional: shorthand to set the changeReferenceCallback.
 * @see setChangeReferenceCallback
 */
function Collectable(descriptor, changeReferenceCallback){
    this.descriptor = descriptor==null ? JSON.parse(collectableDefaultDescriptor) : descriptor
    
    if (this.super==null){
        this.super = {}
    }
    
    /**
     * @function setChangeReferenceCallback
     * @memberof Collectable
     * @description Inherited on super.
     *                  Sets the callback for when the collection descriptor is non-blind and the collectable needs to change it's name.
     * @param {function} changeReferenceCallback Reference to a function of the collectionist to change external reference.
     *                                           Function should take 2 parameters: old reference, new reference
     */
    this.super.setChangeReferenceCallback = function(changeReferenceCallback){
        this.super.changeReferenceCallback = changeReferenceCallback
    }.bind(this)
    
    this.super.setChangeReferenceCallback(changeReferenceCallback)
    
    /**
     * @function getDescriptor
     * @description Inherited directly. Returns reference to descriptor
     * @returns {object} Descriptor object
     */
    this.getDescriptor = function(){
        return this.descriptor
    }
    
    //==== Name
    
    /**
     * @function getName
     * @description Inherited directly
     * @memberof Collectable
     * @returns {string} Name of the collectable
     */
    this.getName = function(){
        return this.descriptor["name"]
    }

    /**
     * @function setName
     * @description Inherited directly
     * @memberof Collectable
     * @param {string} name Name of the collectable
     */
    this.setName = function(name){
        // Attempt to change external reference (name)
        try{
            this.super.changeReferenceCallback(this.descriptor["name"], name)
        }catch{
                
        }
        // Now change internal name
        this.descriptor["name"] = name
    }
}

module.exports.Collectable = Collectable


collectableDefaultDescriptor = '{\
    "name": "",\
}'
