/**
 * @class Ext.Component
 *
 * <p>
 * Component implement an API for rendering and special
 * widget rendering on different devices.
 * </p>
 * 
 * <p>
 * By creation of an instance of the Component class, 
 * the UI control to be wrapped (Mostly a View or Window)
 * will be wrapped inside this abstract class.
 * </p>
 *
 * <p>
 * Normally you will extend this class by calling Ext.createCmp()
 * and put the resulting class code in /Components with the same name
 * as the component.
 * </p>
 *
 * <p>
 * /Component/MainScreen.js may contain such code:
 * </p>
 *
 * <pre>
 * Ext.createCmp('MainScreen', {
 *     xtype: 'window',
 *     render: function() {
 *         // this.cmp references a Ti.UI.Window instance!
 *         this.cmp.add(...);
 *     }
 * });
 * </pre>
 *
 * <p>
 * This is designed to encapsulate different methods and attributes 
 * in view modules. So all the rendering and logical code of the MainScreen
 * shall be implemented in the MainScreen component class.
 * </p>
 * 
 * <p>
 * To create an instance of that class you can simply class Ext.initCmp('MainScreen'); 
 * </p>
 *
 * <p>
 * By default this happens inside of Activities. So the Main-Activity would
 * call Ext.initCmp('MainScreen') in it's start() method.
 * </p>
 *
 * <pre>
 *     // Main screen
 *     this.mainScreen = Ext.initCmp("MainScreen"); // Calls the constructor()
 *     this.mainScreen.show();
 * </pre>
 *
 * <p>
 * Call show() or hide() to show or hide the main UI component.
 * The main UI component needs to be assigned in the initComponent() method.
 * This happens automatically by default. (Using the xtype-property)
 * </p>
 *
 * <p>
 * If you don't want to use xtype, you can override the initComponent()
 * like the render() method and assign the this.cmp attribute as you want.
 * </p>
 *
 * <p>
 * Like in the Activity-class you can implement a renderAndroid(),
 * renderiPhone() and renderiPhone() method that will be called on these
 * devices instead of the render() method.
 * </p>
 */
Ext.Component = Ext.extend(Object, {


    // Component reference
    cmp: null,
    
    
    constructor: function(cfg) {
        
        // Apply prototype config on instance overlay
        cfg = Ext.applyIf(cfg, this);
        
        // Apply whole config on instance
        Ext.apply(this, cfg);

        // Defined params
        if (!Ext.isDefined(cfg.params)) {
            cfg.params = {};
            for (param in cfg) {
                if (Ext.isPrimitive(cfg[param])) {
                    cfg.params[param] = cfg[param];
                }
            }   
        }
        
        // Initializes the component instance
        this.initComponent(cfg);
        
        // Private listener initialization
        this.initListeners();
        
        // Call the init method
        this.init();
        
        // For switched rendering
        if (Ext.isAndroid) {
        
            // Renders on Android
            this.renderAndroid();
        } 
        
        if (Ext.isiPhone) {
        
            // Renders on iPhone
            this.renderiPhone();
        }
        
        if (Ext.isiPad) {
        
            // Renders on iPad
            this.renderiPad();
        }
    },
    
    
    /**
     * Initializes the component instance
     *
     * @param {Object} cfg Component instance config
     * @return {void}
     */
    initComponent: function(cfg) {
    
        // Create Titanium UI instance by xtype definition
        if (Ext.isDefined(cfg.xtype)) {
            
            if (Ext.isDefined(Ext.xtype[cfg.xtype])) {
                this.cmp = Ext.xtype[cfg.xtype](cfg.params);
            } else {
                Ext.log("Attention: The given xtype: '" + cfg.xtype + "' is not defined. Mis-spelled?");
            }
            
        }
    },
    
    
    /**
     * Adds a control to the component
     *
     * @param {Ti.UI.*} uiInstance Instance of a Titanium UI control
     * @return {Ti.UI.*} Given instance 
     */
    add: function(uiInstance) {
        if (this.cmp !== null) {
            this.cmp.add(uiInstance);
        }
    },
    
    
    /**
     * Initializes the listeners to 
     */
    initListeners: function() {
    
        // Check for listeners-Attribute
        if (Ext.isDefined(this.listeners)) {
            for (listener in this.listeners) {
            
                // Add event listener on the fly
                this.on(listener, this.listeners[listener]);
            }
        }
    },
    
    
    /**
     * This method gets called after initComponent were called
     *
     * @return {void}
     */
    init: function() {
        Ext.log("You may override the init() method!");
    },
    
    
    /**
     * Renders on every device.
     * Override this method to implement auto-adding
     * especially for views appended to the window.
     *
     * @return {void}
     */
    render: function() {
        Ext.log("You may override the render() method!");
    },
    
    
    /**
     * Renders on ANDROID devices ONLY.
     * Override this method to implement auto-adding
     * especially for views appended to the window.
     *
     * @return {void}
     */
    renderAndroid: function() {
        this.render();
    },
    
    
    /**
     * Renders on iPhone devices ONLY.
     * Override this method to implement auto-adding
     * especially for views appended to the window.
     *
     * @return {void}
     */
    renderiPhone: function() {
        this.render();
    },
    
    
    /**
     * Renders on iPad devices ONLY.
     * Override this method to implement auto-adding
     * especially for views appended to the window.
     *
     * @return {void}
     */
    renderiPad: function() {
        this.render();
    },
    
    
    /**
     * Shows the component if method is available
     *
     * @return {Boolean} Successful or not
     */
    show: function() {
    
        if (Ext.isDefined(this.cmp) && this.cmp != null) {
        
            if (Ext.isDefined(this.cmp.open)) {
                this.cmp.open();
            }
            
            if (Ext.isDefined(this.cmp.show)) {
                this.cmp.show();
            }
            return true;
        }
        return false;
    },
    
    
    /**
     * Hides the component if method is available
     *
     * @return {Boolean} Successful or not
     */
    hide: function() {
    
        if (Ext.isDefined(this.cmp) && this.cmp != null) {
        
            if (Ext.isDefined(this.cmp.close)) {
                this.cmp.close();
            }
        
            if (Ext.isDefined(this.cmp.hide)) {
                this.cmp.hide();
            }
        }
        return false;
    },
    
    
    /**
     * Adds an event listener to this.cmp (!)
     *
     * @param {String} eventName Name of the event
     * @param {Function fn       Function to execute
     * @return {Boolean} True, if successful
     */
    on: function(eventName, fn) {
        if (Ext.isDefined(this.cmp) && Ext.isDefined(this.cmp.addEventListener)) {
            this.cmp.addEventListener(eventName, fn.createDelegate(this));
            return true;
        }
        return false;
    }
});


/**
 * @class Ext.ComponentHelper
 * @singleton
 * 
 * Class with helper methods applying to UI components.
 */
Ext.ComponentHelper = {
    
    
    /**
     * Method to wrap component, add to metrics manager,
     * and empower the component with special features.
     * 
     * @param {Ti.UI.*} cmp UI component instance to register
     * @return {Ti.UI.*} Given (extended) UI component instance
     */
    wrap: function(cmp) {
        
        // Add component to metrics class instance
        Ext.MetricsMgr.add(cmp);
    
        // Wraps event listener for exified api
        if (Ext.isDefined(cmp.addEventListener)) {
            cmp.on = function(eventName, fn) {
                cmp.addEventListener(eventName, fn);
            };
        }
        return cmp;
    },
    
    
    /**
     * Method to wrap windows, add to metrics manager,
     * and empower the window with special features.
     * 
     * @param {Ti.UI.Window} wnd UI window instance to register
     * @return {Ti.UI.Window} Given (extended) UI window instance
     */
    wrapWindow: function(wnd) {
    
        // Add window to metrics class instance
        Ext.MetricsMgr.addWindow(wnd);
    
        // Wraps event listener for exified api
        if (Ext.isDefined(wnd.addEventListener)) {
            wnd.on = wnd.addEventListener;
        }
        return wnd;
    }
};

/**
 * Shortcut aliases
 */
C = window.C = Ext.ComponentHelper.wrap;
W = window.W = Ext.ComponentHelper.wrapWindow;