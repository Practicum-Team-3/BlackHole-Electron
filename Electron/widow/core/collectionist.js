/**
 * @class Collectionist
 * @description Object that keeps a collection of descriptor modifiers with their descriptors
 * @version 1.0.0
 * @param {object} descriptor Collection descriptor object
 */
function Collectionist(descriptor, _collectableClass){
    var CollectableClass = _collectableClass
    
    this.super = {}
    
    /**
     * @function setDescriptor
     * @description Inherited on super.
     *                  Called upon instantiation, this method sets up the collection
     *                  from the passed descriptor
     * @memberof Collectionist
     * @param {object} descriptor Collection descriptor object
     */
    this.super.setDescriptor = function(descriptor){
        this.descriptor = descriptor
        this.collection = []

        // Create InstalledMachine instance per machine from descriptor
        this.descriptor.forEach(function(collectableDescriptor){
            this.collection.push(new CollectableClass(collectableDescriptor))
        }.bind(this))
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
        return this.collection
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
     *                  if another item already has that name, unless allowNameDuplicates is passed false
     * @memberof Collectionist
     * @param {Collectable} collectable     Collectable object to add
     * @param {boolean} allowNameDuplicates     Pass false for the add operation to fail if another
     *                                      collectable exists with the same name
     * @returns {boolean} Success of the operation. Always returns true if duplicates are allowed
     */
    this.super.add = function(collectable, allowNameDuplicates=true){
        if (this.collection.includes(collectable) ||
            !allowNameDuplicates && this.super.getCollectablesByName(collectable.getName()).length>0){
            return false
        }
        // Add to descriptor
        this.descriptor.push(collectable.getDescriptor())
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
        this.descriptor.splice(this.descriptor.indexOf(collectable.getDescriptor()), 1)
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
 */
function Collectable(descriptor){
    this.descriptor = descriptor==null ? JSON.parse(collectableDefaultDescriptor) : descriptor
    
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
        this.descriptor["name"] = name
    }
}

module.exports.Collectable = Collectable


collectableDefaultDescriptor = '{\
    "name": "",\
}'
