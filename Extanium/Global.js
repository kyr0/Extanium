/**
 * @class Ext.Global
 * @singleton
 *
 * <p>
 * Class that enables a global variable store.
 * The stored values are NOT SESSION PERSISTENT.
 * </p>
 */
Ext.Global = {


    /**
     * Sets a value identified by name
     *
     * @param {String} name Name identifier
     * @param {Mixed} value Value to set
     * @return {void}
     */
    set: function(name, value) {
        Ext.Global[name] = value;
    },
    
    
    /**
     * Returns value by name
     *
     * @return {Mixed} Value
     */
    get: function(name) {
        return Ext.Global[name];
    }
};