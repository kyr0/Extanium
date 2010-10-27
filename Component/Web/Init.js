// BEWARE:   GL-Code is executed in WebView scope!
// BEWARE 2: ONLY ADD CODE INSIDE OF initGL()! 
//           There are timing reasons, the app will crash 
//           when API-calls are added somewhere else.

// Web init
var Web = Web || {};

/**
 * Initializing function for the WebView canvas.
 * Will be called when WebView and bootstrapping is ready.
 *
 * @param {Object} params Parameters set by initParams config
 * @return {void}
 */
Web.init = function(params) {
        
    // Start your WebView journey here.
    
    // Include ThreeJS library
    Web.include('Extanium/thirdparty/extcore/ext-core.js', 'extReady');
  
    // new Ext.WebView({initParams: {...}}) results in
    //for (name in params) {
    //    alert(name + " : " + params[name]);
    //}
    
    // Send some data back
    //Web.sendData({name: 'Aron'});
    
    // Wait for include flags to be declared
    Web.onMultiReady('extReady', function() {
        
        // Finally wait for JS real declares - timing matters ;-)
        Web.when(window['Ext'], function() {
        
            alert("Ext Core is here!");
            alert(Ext);
        });
        
    });
}


/**
 * Will be called if you call Ext.WebView.sendData(data)
 *
 * @param {Object} data Data of the sendData(data) param
 * @return {void}
 */
Web.receivedData = function(data) {
    
    //alert("Received data from Ext.WebView context:");
    
    // webviewInst.sendData({name: 'Aron'}) end here:
    //for (name in data) {
    //    alert(name + " : " + data[name]);
    //}
}