/**
 * @class Ext
 * @singleton
 * 
 * <p>
 * This base class of the Extanium framework introduces the 
 * Extanium namespace and all it's core methods and properties.
 * </p>
 *
 * @author Aron Homberg
 * @license MIT license
 */
Ext.apply(Ext, {
    trVisualDebug: 'Visual debug',
    trClose: 'Close'
});
 
 
Ext.apply(Ext, {
    
    
    /**
     * Determines if the app runs first time
     * @type {Boolean}
     */
    isFirstRun: true,
    
    
    /**
     * Determines if app preferences are set (first-time user data setup procedure)
     * @type {Boolean} 
     */
    isPreferenceSet: false,
    
    
    /**
     * Checks if running on Android
     * @type {Boolean} 
     */
    isAndroid: false,


    /**
     * Checks if running on iPhone
     * @type {Boolean}
     */
    isiPhone: false,


    /**
     * Checks if running on iPad
     * @type {Boolean}
     */
    isiPad: false,
    
     
    /**
     * Controls, if log messages will be shown or not (default: false)
     * @cfg {Boolean}
     */
    enableDebugging: false,
    
    
    /**
     * Controls, if log messages will appear as alert dialogs (default: false)
     * @cfg {Boolean} 
     */
    enableVisualDebugging: false,
    
    
    /**
     * Role of the logging severity from where logging is enabled. Known roles: info, debug, warn
     * @cfg {String} 
     */
    debugLogLevel: Ext.LOGLEVEL_WARN,
    
    
    /**
     * Logs only warning messages
     * @type {String}  
     */
    LOGLEVEL_WARN: 'warn',
    
    
    /**
     * Logs all appearing messages
     * @type {String} 
     */
    LOGLEVEL_INFO: 'info',
    
    
    /**
     * Logs warning and debug messages
     * @type {String}
     */
    LOGLEVEL_DEBUG: 'debug',
    
    
    /**
     * Sets the filename to load localization from
     * @type {String}      
     */
    enableLocalization: false,
    
    
    /**
     * Maximum display width 
     * @type {Number} 
     */
    maxWidth: Ti.Platform.displayCaps.platformWidth,
    
    
    /**
     * Maximum display height
     * @type {Number} 
     */
    maxHeight: Ti.Platform.displayCaps.platformHeight,
    
    
    /**
     * XTypes to Titanium class mapping
     * @type {Object}
     */
    xtype: {
        window: function (cfg) {return W(Ti.UI.createWindow(cfg));},
        view: function (cfg) {return C(Ti.UI.createView(cfg));},
        alert: function (cfg) {return C(Ti.UI.createAlertDialog(cfg));}
    },
    
    
    /**
     * Method for logging.
     * @param {Mixed} logMessage Message to log
     * @param {String} severity  Severity role name
     * @return {void}
     */
    log: function(logMessage) {
    
        var severity = Ext.LOGLEVEL_INFO;
        if (Ext.isDefined(arguments[1])) {
            severity = arguments[1];
        }
        
        // Only log if debugging is enabled
        if (Ext.enableDebugging) {
        
            if (this.debugLogLevel == Ext.LOGLEVEL_INFO || (this.debugLogLevel == Ext.LOGLEVEL_DEBUG && (severity == Ext.LOGLEVEL_DEBUG || severity == Ext.LOGLEVEL_WARN)) || this.debugLogLevel == Ext.LOGLEVEL_WARN && severity == Ext.LOGLEVEL_WARN) {
            
                // Pretty-print if JSON
                if (Ext.isObject(logMessage)) {
                    logMessage = JSON.stringify(logMessage);
                }
            
                Ti.API.info('[Extanium] ' + logMessage);
                
                // Show alert message box
                if (Ext.enableVisualDebugging) {
                    Ext.alert(Ext.trVisualDebug, '[Extanium] ' + logMessage);
                }
            }
        }
    },
    debug: function(msg) { Ext.log(msg, Ext.LOGLEVEL_DEBUG)},
    warn: function(msg) { Ext.log(msg, Ext.LOGLEVEL_WARN)},  
    
    
    /**
     * Shows an alert box
     *
     * @param {String} title Title of the alert box
     * @param {String} msg Message to show
     * @return {void}
     */
    alert: function(title, msg) {
    
        var dialog = Ti.UI.createAlertDialog({
            title: title,
            message: msg,
            buttonNames: [Ext.trClose]
        });
        dialog.addEventListener('click', function() {
            dialog.hide();
        });
        dialog.show();
    },
    
    
    /**
     * Evaluates the runtime environment
     * and sets some attributes.
     *
     * @return {void}
     */
    setupRuntime: function() {
        
        // --- FIRST TIME SWITCH
        if (!Ext.Registry.has('wasFirstRun') ||
            Ext.Registry.getBoolean('wasFirstRun') == false) {
            Ext.isFirstRun = true;
        } else {
            Ext.isFirstRun = false;
        }
        Ext.Registry.setBoolean('wasFirstRun', true);
        
        
        // --- APP PREFERENCE SWITCH
        if (Ext.Registry.has("preferencesSet") || Ext.Registry.getBoolean("preferencesSet") != true) {
            Ext.isPreferenceSet = true;
        }
        
        
        // --- PLATFORM IDENT
        if (Titanium.Platform.osname == "android") {
            Ext.isAndroid = true;
        }
        
        if (Titanium.Platform.osname == "iphone") {
            Ext.isiPhone = true;
        }
        
        if (Titanium.Platform.osname == "ipad") {
            Ext.isiPad = true;
        }
    },
    
    
    /**
     * Sets the preferences set
     * @return {void}
     */
    setPreferenceSet: function() {
        Ext.isPreferenceSet = true;
        Ext.Registry.setBoolean('preferencesSet', true);
    },
    
    
    /**
     * Unsets the preferences set
     * @return {void}
     */
    unsetPreferenceSet: function() {
        Ext.isPreferenceSet = false;
        Ext.Registry.setBoolean('preferencesSet', false);
    },
    
    
    /**
     * Clears the runtime properties stored by the framework.
     * E.g. the first run switch property.
     * @return {void}
     */
    clearRuntime: function() {
        
        // Clear first run switch property
        Ext.Registry.setBoolean('wasFirstRun', false);
        
        // Clear preference switch property
        Ext.Registry.setBoolean('preferencesSet', false);
    },
    
    
    /**
     * Executes the given function in App scope
     * by providing the given arguments if the device
     * is Android-based.
     *
     * @param {Function} fn Function to execute
     * @param {Array} args Arguments for the function
     * @return {Mixed|Boolean} Function return value or false if not on android
     */
    onAndroid: function(fn, args) {
        if (Ext.isAndroid) {
            return fn.createDelegate(Ext, args)();
        }
        return false;
    },
    
    
    /**
     * Executes the given function in App scope
     * by providing the given arguments if the device
     * is iPhone-based.
     *
     * @param {Function} fn Function to execute
     * @param {Array} args Arguments for the function
     * @return {Mixed|Boolean} Function return value or false if not on iPhone
     */
    oniPhone: function(fn, args) {
        if (Ext.isiPhone) {
            return fn.createDelegate(Ext, args)();
        }
        return false;
    },
    
    
    /**
     * Executes the given function in App scope
     * by providing the given arguments if the device
     * is iPad-based.
     *
     * @param {Function} fn Function to execute
     * @param {Array} args Arguments for the function
     * @return {Mixed|Boolean} Function return value or false if not on iPad
     */
    oniPad: function() {
        if (Ext.isiPad) {
            return fn.createDelegate(Ext, args)();
        }
        return false;
    },
    
    
    /**
     * Reference for Titanium.include
     */
    include: Ti.include,
    
    
    /**
     * Creates an activity by name and object configuration
     * 
     * @param {String} name Name of the activity
     * @param {Object} obj  Configuration of the activity
     * @return {void}
     */
    createActivity: function(name, obj) {
        Ext.Activities[name] = Ext.extend(Ext.Activity, obj);
    },
    
    
    /**
     * Starts an activity by name
     * 
     * @param {String} name Name of the activity
     * @param {Object} cfg  Overlay activity configuration
     * @return {Object} Activity instance
     */
    startActivity: function(name, cfg) {
        
        // Include activity code
        Ext.include('/Activity/' + name + '.js');
        Ext.loadLocalization();
        
        if (!Ext.isDefined(cfg)) {
            cfg = {};
        }
        Ext.Activities[name] = new Ext.Activities[name](cfg);
        return Ext.Activities[name];
    },
    
    
    /**
     * Creates a component by name and object configuration
     * 
     * @param {String} name Name of the component
     * @param {Object} obj  Configuration of the component
     * @return {void}
     */
    createCmp: function(name, obj) {
        Ext.Components[name] = Ext.extend(Ext.Component, obj);
    },
    
    
    /**
     * Initializes a component by name
     *
     * @param {String} name Name of the component to load
     * @param {Object} cfg  Overlay component configuration
     * @return {Object} Component instance
     */
    initCmp: function(name, cfg) {
    
        // Generate id if not set
        var cfgUndef = false;
        if (!Ext.isDefined(cfg)) {
        
            cfgUndef = true;
            cfg = {};
        }
        
        if (!Ext.isDefined(cfg.id)) {
            cfg.id = "cmp" + (++Ext.ComponentInstances.ID);
        }
        Ext.include('/Component/' + name + '.js');
        
        Ext.loadLocalization();
        
        Ext.ComponentInstances[cfg.id] = new Ext.Components[name](cfg);
        return Ext.ComponentInstances[cfg.id];
    },
    
    
    /**
     * Returns a component instance by id
     *
     * @param {String} id Id of the component instance
     * @param {Ext.Component} Component instance
     */
    getCmp: function(id) {
        return Ext.ComponentInstances[id];
    },
    
    
    /**
     * Loads the locale
     * @return {void} 
     */
    loadLocalization: function() {
        if (Ext.enableLocalization) {
            Ext.include('/Localization/' + Ti.Platform.locale + '.js');
        }
    },
    
    
    /**
     * Translates a class by overriding
     * 
     * @param {Object} origClass Class prototype object
     * @param {Object} transObj  Object holding translation values
     * @return {void}
     */
    tr: function(origClass, transObj) {
        if (Ext.isDefined(origClass)) {
            Ext.override(origClass, transObj);
        }
    }
});

// Namespace declaration
Ext.Activities = {};
Ext.Components = {};
Ext.ComponentInstances = {};
Ext.ComponentInstances.ID = 0;
      
// Includes the required class files. 
Ext.include('/Extanium/Loader.js');