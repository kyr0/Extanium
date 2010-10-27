/**
 * @class Ext.Activity
 * @extends Object
 * 
 * <p>
 * Constructs the activity which is wrapped inside
 * an abstract class to provide further abstraction.
 * </p>
 *
 * <p>
 * You may extend this class by calling Ext.createActivity():
 * </p>
 *
 * <p>
 * <pre>
 * Ext.createActivity('Main', {
 *
 *   
 *   // Instance storage
 *   mainScreen: null,
 *
 *   start: function() {
 *   
 *       // Main screen
 *       this.mainScreen = Ext.initCmp("MainScreen");
 *       this.mainScreen.show();
 *   },
 *   
 *   stop: function() {
 *   
 *       // Close and delete main screen instance
 *       this.mainScreen.hide();
 *       delete this.mainScreen;
 *   }
 * });
 *
 * </pre>
 * </p>
 *
 * <p>
 * Save this class in a new file in folder /Activities
 * with the same name as the Activity (Main.js).
 * </p>
 *
 * <p>
 * You can start the Activity by calling Ext.startActivity('Main');
 * You can also implement special start methods for different device types:
 * </p>
 * 
 * <p>
 * startiPhone(), startiPad(), startAndroid() will be started if defined
 * rather than start() which is a general purpose start method.
 * </p>
 */
Ext.Activity = Ext.extend(Object, {


    constructor: function(cfg) {
        
        // Overlay prototype by instance config
        Ext.applyIf(this, cfg);
        
        // Call the init method
        this.init();
        
        // For switched startup
        if (Ext.isAndroid) {
        
            // Start on Android
            this.startAndroid();
        } 
        
        if (Ext.isiPhone) {
        
            // Start on iPhone
            this.startiPhone();
        }
        
        
        if (Ext.isiPad) {
        
            // Start on iPad
            this.startiPad();
        }
    },
    
    
    /**
     * Initializes an Activity
     * @return {void}
     */
    init: function() {
        Ext.log("You may override the init() method while implementing an Activity!");
    },


    /**
     * The general activity starting method.
     * Should be overridden, if needed.
     *
     * @return {void}
     */
    start: function() {
        Ext.log("You may override the start() method while implementing an Activity!");
    },
    
    
    /**
     * Starts on ANDROID devices ONLY.
     * Override this method to implement a startup,
     * specially for Android devices.
     *
     * @return {void}
     */
    startAndroid: function() {
        this.start();
    },
    
    
    /**
     * Starts on IPHONE devices ONLY.
     * Override this method to implement a startup,
     * specially for iPhone devices.
     *
     * @return {void}
     */
    startiPhone: function() {
        this.start();
    },
    
    
    /**
     * Starts on IPAD devices ONLY.
     * Override this method to implement a startup,
     * specially for iPad devices.
     *
     * @return {void}
     */
    startiPad: function() {
        this.start();
    },
    
    
    
    /**
     * Stops the activity
     *
     * @return {void}
     */
    stop: function() {
        Ext.log("You may override the stop() method while implementing an Activity!");
    }
});