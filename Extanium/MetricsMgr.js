/**
 * @class Ext.Metrics
 * @singleton
 *
 * Class for holding constants regarding metrics and orientation
 */
Ext.Metrics = {

    
    /**
     * En- or disables automatically scaling of every managed element
     * @type {Boolean}      
     */
    enableAutoScaling: false,


    /**
     * Standard screen resolution width the app was designed for (default: 320)
     * @type {Number} 
     */
    standardWidth: 320,
    
    
    /**
     * Standard screen resolution height the app was designed for (default: 480)
     * @type {Number} 
     */ 
    standardHeight: 480,
    
    
    /**
     * Standard screen resolution the app was designed for (default: true)
     * @type {Boolean}      
     */
    standardPortrait: true,


    /**
     * Constant for portrait orientation (home button on bottom)
     * @type {Number} 
     */
    PORTRAIT: Ti.UI.PORTRAIT,
    
    
    /**
     * Constant for portrait orientation (home button on top)
     * @type {Number} 
     */
    PORTRAIT_UPSIDE: Ti.UI.UPSIDE_PORTRAIT,


    /**
     * Constant for landscape orientation (home button left)
     * @type {Number} 
     */
    LANDSCAPE_LEFT: Ti.UI.LANDSCAPE_LEFT,
    
    
    /**
     * Constant for landscape orientation (home button right)
     * @type {Number} 
     */
    LANDSCAPE_RIGHT: Ti.UI.LANDSCAPE_RIGHT
};

// Apply orientation as needed
if (Ext.Metrics.standardPortrait) {
    Ti.UI.orientation = Ext.Metrics.PORTRAIT;
} else {
    Ti.UI.orientation = Ext.Metrics.LANDSCAPE_RIGHT;
}
 
 
/**
 * @class Ext.MetricsMgr
 * @singleton
 *
 * A class to calculate the position and scaling of
 * UI elements handling width and height determination
 * and positioning on different screen resolutions.
 */
Ext.MetricsMgr = {


    // Metrics registry
    registry: [],
    
    
    // Window metrics registry
    windowRegistry: [],


    /**
     * Current orientation of the device
     * @type {Number} 
     */
    currentOrientation: Ext.Metrics.PORTRAIT,
    
    
    /**
     * Currently set static orientation
     * @type {Number} currentStaticOrientation 
     */
    currentStaticOrientation: Ext.Metrics.PORTRAIT,
    
    
    /**
     * Indicates if app is statically orientated
     * @type {String} 
     */
    isStaticOrientated: false,
     
    
    /**
     * Adds an element to the metrics registry.
     * May be wrapped if needed.
     *
     * @param {Ti.UI.*} ele UI element holding the attributes height, width, top and left
     * @return {void}
     */
    add: function(ele) {
    
        // Create a wrapped metrics object
        var currentEle = Ext.MetricsMgr.wrapElement(ele);
                
        // Add element to registry
        Ext.MetricsMgr.registry.push(currentEle);
        
        // Calculates and applies the new metric values to an instance
        Ext.MetricsMgr.calc(currentEle);   
        
        return ele;
    },
    
    
    /**
     * Adds a window to the metrics registry to
     * manage it's orientation.
     *
     * @param {Ti.UI.Window} wnd Window instance to manage
     * @return {void}
     */
    addWindow: function(wnd) {
        
        // Apply orientation
        if (Ext.MetricsMgr.isStaticOrientated) {
            Ext.MetricsMgr.applyWindowOrientation(wnd);
        }
        
        // Add window to registry
        Ext.MetricsMgr.windowRegistry.push(wnd);
        
        return wnd;
    },
    
    
    /**
     * Creates an element wrapping object holding the metrics info.
     *
     * @param {Object} ele UI element holding the attributes height, width, top and left
     * @return {Object} Metrics element wrapping object
     */
    wrapElement: function(ele) {
    
        var tHeight, tWidth, tTop, tLeft = 0;
        
        // Is element set?
        if (Ext.isDefined(ele) && Ext.isObject(ele)) {
        
            if (Ext.isDefined(ele.height)) {
                tHeight = ele.height;
            }
            
            if (Ext.isDefined(ele.width)) {
                tWidth = ele.width;
            }
            
            if (Ext.isDefined(ele.top)) {
                tTop = ele.top;
            }
            
            if (Ext.isDefined(ele.left)) {
                tLeft = ele.left;
            }
        } else {
            ele = {};
        }
        
        // Build wrap-element to handle
        return {
            height: tHeight,
            width: tWidth,
            left: tLeft,
            top: tTop,
            instance: ele
        }; 
    },
    
    
    /**
     * Calculates one or more wrap-elements and applies their
     * new metrics.
     * 
     * @param {Object|Array} wrapEle Wrapped metrics element 
     * @param {Boolean} isLandscape Recalculation in landscape mode?
     * @return {void}
     */
    calc: function(wrapEle) {
    
        if (Ext.isArray(wrapEle)) {
        
            // Walk any element, recursive call
            for (var i=0; i<wrapEle.length; i++) {
                Ext.MetricsMgr.calc(wrapEle[i], arguments[1]);
            }
        } else {
            /*
            // Do calculation and apply
            var curWidth  = Ti.Platform.displayCaps.platformWidth;
            var curHeight = Ti.Platform.displayCaps.platformHeight;
            
            var stdWidth  = Ext.Metrics.standardWidth;
            var stdHeight = Ext.Metrics.standardHeight;
            
            var isLandscape = false;
            if (Ext.isDefined(arguments[1]) && arguments[1] === true) {
                
                // Running in landscape mode, switch width and height!
                //Ext.log("Running in LANDSCAPE", Ext.LOGLEVEL_DEBUG);
                
                var _curWidth = curWidth;
                curWidth  = curHeight;
                curHeight = _curWidth;
                
                var _stdWidth = stdWidth;
                stdWidth  = stdHeight;
                stdHeight = _stdWidth;
                
                isLandscape = true;
            }
            var gapWidth  = stdWidth  - curWidth;
            var gapHeight = stdHeight - curHeight; 
            */
            /*
            Ext.log("Std width: " + stdWidth, Ext.LOGLEVEL_DEBUG);       
            Ext.log("Cur width: " + curWidth, Ext.LOGLEVEL_DEBUG);
            Ext.log("gap width: " + gapHeight, Ext.LOGLEVEL_DEBUG);
                       
            Ext.log("std height: " + stdHeight, Ext.LOGLEVEL_DEBUG);
            Ext.log("Cur height: " + curHeight, Ext.LOGLEVEL_DEBUG);
            Ext.log("gap height: " + gapHeight, Ext.LOGLEVEL_DEBUG);
            */
            
            // Set elements position and scaling based on the calculation if changed
            /*
            if (gapWidth !== 0 || gapHeight !== 0) {
            
                if (isLandscape && Ext.Metrics.standardPortrait == true) {
                    
                    // Metrics algorithm for landscape-morph and up/down-scaling
                    Ext.log("Landscape rotate recalculation & scale", Ext.LOGLEVEL_DEBUG);
                
                } else {
            
                    // Metrics algorithm for standard portrait up/down-scaling
                    Ext.log("Portrair recalculation & scale", Ext.LOGLEVEL_DEBUG);
                
                    
                }
            }
            */
            
            // Apply recalculated values
            Ext.apply(wrapEle.instance, wrapEle);
        }
    },
    
    
    // Handles orienation changes.
    listenToOrientationChange: function() {
    
        Ti.Gesture.addEventListener('orientationchange', function(evt) {
            
            // Set current orientation
            Ext.MetricsMgr.currentOrientation = evt.orientation;
            
            // Auto-rescale may only happen when static orientation isn't set
            if (!Ext.MetricsMgr.isStaticOrientated) {
            
                // Really apply the orientation change
                Titanium.UI.orientation = evt.orientation;
                
                var isLandscape = false;
                if (Ext.MetricsMgr.currentOrientation == Ext.Metrics.LANDSCAPE_LEFT || 
                    Ext.MetricsMgr.currentOrientation == Ext.Metrics.LANDSCAPE_RIGHT) {
                    isLandscape = true;
                }
                
                // Apply orientation
                Ext.MetricsMgr.applyWindowOrientation(Ext.MetricsMgr.windowRegistry, Ext.MetricsMgr.currentOrientation);
                
                // Recalculate view in orientation
                Ext.MetricsMgr.calc(Ext.MetricsMgr.registry, isLandscape);
            }
        });
    },
    
    
    /**
     * Sets the orientation of all windows and does
     * a full apply to all managed windows.
     *
     * @param {Number} orientation Orientation of Ext.Metrics to apply statically 
     * @return {void}
     */
    setStaticOrientation: function(orientation) {
    
        // Set static orientation without auto-orientation handling
        Ext.MetricsMgr.isStaticOrientated = true;
        Ext.MetricsMgr.currentStaticOrientation = orientation;
        
        // Apply new orientation to all registered windows
        Ext.MetricsMgr.applyWindowOrientation(Ext.MetricsMgr.windowRegistry);
    },
    
    
    /**
     * Applies a static window orientation to one or more windows
     *
     * @param {Object|Array} wnd One or more windows to apply a new orientation to
     * @param {Number} orientation Specific orientation (Optional)
     * @return {void}
     */
    applyWindowOrientation: function(wnd) {
    
        var orientation = Ext.MetricsMgr.currentStaticOrientation;
        if (Ext.isDefined(arguments[1])) {
            orientation = arguments[1];
        }
    
        if (Ext.isArray(wnd)) {
        
            // Walk any window, recursive call
            for (var i=0; i<wnd.length; i++) {
                Ext.MetricsMgr.applyWindowOrientation(wnd[i], arguments[1]);
            }
        } else {
            
            // Do apply new orientation mode
            wnd.orientationModes = [orientation];
        }
    }
};

// Activate global orientation listening
Ext.MetricsMgr.listenToOrientationChange();