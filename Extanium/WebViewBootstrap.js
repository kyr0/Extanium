// Web init
var Web = Web || {};

/**
 * Sends data back to the Ext.WebView context    
 * 
 * @param {Object} data Data to send
 * @return {void}
 */
Web.sendData = function(data) {
    Ti.App.fireEvent('wvdataTransmitted', {data: JSON.stringify(data)});
};


/**
 * Calls the WebView-context to load a script given by url.
 * The toggleToSet param will be set as boolean variable in window scope.
 * The optional fn param may be a function which will be called when the script is included.
 *
 * @param {String} url URL of the script to include
 * @param {String} toggleToSet Name of the toggle to set as load flag
 * @param {Function} fn Function to execute when flag is set (Optional)
 * @return {void}
 */
Web.include = function(url, toggleToSet, fn) {
    Ti.App.fireEvent('wvincludeCmd', {url: url, toggle: toggleToSet});
    if (typeof fn != "undefined" && typeof fn == "function") {
        Web.onIncludeReady(toggleToSet, fn);
    }
};


/**
 * Waits for an include and calls the given function with arguments
 * 
 * @param {String} toggleName Name of the toggle to set
 * @param {Function} fn Function to call when include has finished
 * @param {Object} arg Object to append as argument to the given function (Optional)
 * @return {void}
 */
Web.onIncludeReady = function(toggleName, fn) {

    var waitForToggle = setInterval(function() {
        
        if (window[toggleName] != "undefined" && 
            window[toggleName] == true) {
            
            try {
                if (arguments.length == 3) {
                    fn(arguments[2]);
                } else {
                    fn();
                }
            } catch (e) {
                alert(e);
            }
            clearInterval(waitForToggle);
        }
    }, 50);
};


/**
 * <p>
 * You can simply put as many toggleName arguments you want 
 * into this method. The given fn function (the last argument) 
 * will be called, when all toggles are set.
 * </p>
 * 
 * <pre>Web.onMultiReady('cameraReady', 'cubeReady', function() {...});</pre>
 * 
 * @param {String...} ... As many string toggle names you want
 * @param {Function} fn The function to call when all toggles are set at last
 * @return {void}
 */
Web.onMultiReady = function() {

    var fn = function() {};
    
    if (typeof arguments[(arguments.length - 1)] == "function") {
        fn = arguments[(arguments.length - 1)];
        
    }
    
    var togglesToCheck = [];
    for (var i=0; i<arguments.length; i++) {
        if (typeof arguments[i] == "string") {
            togglesToCheck.push(arguments[i]);
        }
    }
    
    // Interval to 
    var multiCheck = setInterval(function() {
        var isReady = true;
        for (var i=0; i<togglesToCheck.length; i++) {
            if (typeof window[togglesToCheck[i]] == "undefined" || 
                window[togglesToCheck[i]] != true) {
                isReady = false;
            }
        }
        
        if (isReady) {
            try {
                fn();
            } catch (e) {
                alert(e);
            }
            clearInterval(multiCheck);
        }
    }, 50);
};


/**
 * <p>
 * You can simply put as many toggleName arguments you want 
 * into this method. The given fn function (the last argument) 
 * will be called, when all toggles are set.
 * </p>
 * 
 * <pre>Web.onMultiReady('cameraReady', 'cubeReady', function() {...});</pre>
 * 
 * @param {String...} ... As many string toggle names you want
 * @param {Function} fn The function to call when all toggles are set at last
 * @return {void}
 */
Web.when = function() {

    var fn = function() {};
    
    if (typeof arguments[(arguments.length - 1)] == "function") {
        fn = arguments[(arguments.length - 1)];
        
    }
       
    // Interval to 
    var multiCheck = setInterval(function() {
        var isReady = true;
         
        var togglesToCheck = [];
        for (var i=0; i<arguments.length; i++) {
            if (typeof arguments[i] == "undefined") {
                isReady = false;
            }
        }
        
        if (isReady) {
            try {
                fn();
            } catch (e) {
                alert(e);
            }
            clearInterval(multiCheck);
        }
    }, 50);
};


/**
 * Adds the event handlers to transceive data between
 * the contexts of (WebView) and Ext.WebView (Titanium).
 * 
 * @return {void}
 */ 
Web.bootstrap = function() {
    
    /**
     * Event handler to call if load catched by outer instance.
     *
     * @param {Object} data Outer WebView/Ext.WebView configuration
     * @return {void}
     */    
    Web.onIncludeReady('viewReadyLoaded', function() {
    
        // Initialize the gl scope
        if (typeof Web.init != "undefined") {
            Web.init(JSON.parse(window.WebViewConfig.initParams));
        }
    });
    
    
    /**
     * Event handler to call if data were sent to GL context
     *
     * @param {Object} data Data sent by Ext.WebView.sendData(data)
     * @return {void}
     */
    Ti.App.addEventListener('wvdataReceived', function(data) {
        
        if (typeof Web.receivedData != "undefined") {
            Web.receivedData(JSON.parse(data.data));
        }
    });
};
    

// Bootstraps the WebView inner basic abstraction layer
Web.bootstrap();
