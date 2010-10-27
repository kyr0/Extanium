/**
 * @class App
 * @singleton
 * @extends Ext.Application
 *
 * Base singleton App class to manage the high-level
 * app code initialization. For example introducing the 
 * fist activities based on the Ext.isFirstRun-attribute.
 */
App = Ext.extend(Ext.Application, {

    /**
     * Indicates if the application is logged in
     * @type {Boolean}
     */
    isLoggedIn: false,
    

	/**
	 * Starts the application runtime.
	 * @return {void}
	 */
	start: function() {
    
        // Enter Main activity
        Ext.startActivity("Main");
    }
});

