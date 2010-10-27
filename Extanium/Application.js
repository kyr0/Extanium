/**
 * @class Ext.Application
 * @extends Object
 * <p>
 * This class introduces the App class prototype for inheritance.
 * Normally this class in only used in /Application.js to define an
 * global application class.
 * </p>
 *
 * <p>
 * By default an instance of that class will be created in the app.js
 * and the start() method will be called automatically with that operation
 * since the onstructor calls it.
 * </p>
 *
 * <p>
 * So if you see some new App() in app.js the start() method of the Application.js will be called. 
 * </p>
 */
Ext.Application = Ext.extend(Object, {


    constructor: function() {
    
        // Sets up the runtime
        Ext.setupRuntime();
        
        // Starts the app
        this.start();
    },
    
    
    /**
     * Starts the application
     * @return {void}
     */
    start: function() {
        Ext.log("The start() method of the Application should be overridden.");
    }
});