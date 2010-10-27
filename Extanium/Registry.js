/**
 * @class Ext.Registry
 * @singleton
 *
 * This class handles Titanium properties in an easier way.
 * The values stored via the registry ARE SESSION PERSISTENT.
 */
Ext.Registry = {


    /**
     * Returns a property value as String
     *
     * @param {String} name Name of the propery
     * @return {String} Property value
     */
    getString: Titanium.App.Properties.getString,
    
    
    /**
     * Returns a property value as Boolean
     *
     * @param {String} name Name of the propery
     * @return {Boolean} Property value
     */
    getBoolean: Titanium.App.Properties.getBool,
    
    
    /**
     * Returns a property value as Array
     *
     * @param {String} name Name of the propery
     * @return {Array} Property value
     */
    getArray: Titanium.App.Properties.getList,
    
    
    /**
     * Returns a property value as Number
     *
     * @param {String} name Name of the propery
     * @return {Number} Property value
     */
    getNumber: Titanium.App.Properties.getDouble,
    
    
    /**
     * Returns a property value as Object
     *
     * @param {String} name Name of the propery
     * @return {Object} Property value
     */
    getObject: function(name) {
        return JSON.parse(Ext.Registry.getString(name));
    },
    
    
    /**
     * Sets a Boolean value by name
     *
     * @param {String} name Name of the propery
     * @param {Boolean} value Value of the propery
     * @return {void}
     */
    setBoolean: Titanium.App.Properties.setBool,
    
    
    /**
     * Sets a String value by name
     *
     * @param {String} name Name of the propery
     * @param {String} value Value of the propery
     * @return {void}
     */
    setString: Titanium.App.Properties.setString,
    
    
    /**
     * Sets a Number value by name
     *
     * @param {String} name Name of the propery
     * @param {Number} value Value of the propery
     * @return {void}
     */
    setNumber: Titanium.App.Properties.setDouble,
    
    
    /**
     * Sets an Array value by name
     *
     * @param {String} name Name of the propery
     * @param {Array} value Value of the propery
     * @return {void}
     */
    setArray: Titanium.App.Properties.setList,
    
    
    /**
     * Sets an Object value by name
     *
     * @param {String} name Name of the propery
     * @param {Object} value Value of the propery
     * @return {void}
     */
    setObject: function(name, obj) {
        Ext.Registry.setString(name, JSON.stringify(obj));
    },
    
    
    /**
     * Checks if a property is set by name
     *
     * @param {String} name Name of the propery
     * @return {Boolean} True, if set, false if not
     */
    has: Titanium.App.Properties.hasProperty
};

