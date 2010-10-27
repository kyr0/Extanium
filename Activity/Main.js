/**
 * @class Main
 * 
 * Implements the Main activity.
 */
Ext.createActivity('Main', {

    // Instance storage
    mainScreen: null,
    loginScreen: null,


    /**
     * Code to call on activity init
     * @return {void}
     */
    start: function() {
        
        // Show the main screen
        this.showMainScreen();
    },
    
    
    /**
     * Shows the login screen
     * @return {void}
     */
    showLoginScreen: function() {
        this.loginScreen = Ext.initCmp("LoginScreen");
        this.loginScreen.show();
    },
    
    
    /**
     * Shows the main screen
     * @return {void}
     */
    showMainScreen: function() {
    
        // Main screen
        this.mainScreen = Ext.initCmp("MainScreen");
        this.mainScreen.show();
    },
    
    
    /**
     * Shows the GL screen
     * @return {void}
     */
    showGLScreen: function() {
    
        // GL screen 
        var GLScreen = Ext.initCmp('GLScreen');
        GLScreen.show();
    },
    
    
    /**
     * Stops the activity
     * @return {void}
     */
    stop: function() {
    
        // Close and delete main screen instance
        if (this.mainScreen != null) {
            this.mainScreen.hide();
            delete this.mainScreen;
        }
    }
});