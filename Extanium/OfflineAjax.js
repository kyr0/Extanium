/**
 * @class Ext.OfflineAjax
 * @singleton
 *
 * Class that implements methods to fully provide support 
 * to offline mode requests to be dispatched later if the 
 * app is online again.
 */
Ext.OfflineAjax = {


    // Temporary virtual Ajax request stack
    registry: Ext.Registry.getArray("ajaxstack"),
    
    
    /**
     * Offline Ajax in seconds
     * @var {Number}
     */
    interval: 5,


    /**
     * Registers a request configuration on a persistent stack
     *
     * @param {Object} cfg Request configuration
     * @return {void}
     */
    register: function(cfg) {
    
        // Load current Ajax registry
        Ext.OfflineAjax.registry = Ext.Registry.getArray("ajaxstack");
        
        if (!Ext.isArray(Ext.OfflineAjax.registry)) {
            Ext.OfflineAjax.registry = [];
        }
    
        // Add request to the Ajax request stack
        Ext.OfflineAjax.registry.push({
            request: cfg,
            isDispatched: false
        });
        
        // Persist in Registry
        Ext.Registry.setArray("ajaxstack", Ext.OfflineAjax.registry);
        
        // Start the request loop
        Ext.OfflineAjax.startRequestLoop();
    },
    
    
    // Requests with overloaded success method
    request: function() {
    
        // Only request if device is online
        if (!Titanium.Network.online) {
            return;
        }
    
        // Load current Ajax registry
        Ext.OfflineAjax.registry = Ext.Registry.getArray("ajaxstack");
        
        if (!Ext.isArray(Ext.OfflineAjax.registry)) {
            Ext.OfflineAjax.registry = [];
        }
        
        // Loop every undispatched request 
        var successFunction = null;
        var requestObj = null;
        for (var i=0; i<Ext.OfflineAjax.registry.length; i++) {
        
            if (Ext.OfflineAjax.registry[i].isDispatched == false) {
                
                // Temporary values
                requestObj = Ext.OfflineAjax.registry[i].request;
                successFunction = Ext.OfflineAjax.registry[i].request.success;
                
                // Overload success method with method that applies dispatch flag on request registry
                requestObj.offlineAjaxRegistryIndex = i;
                requestObj.success = function() {
                    successFunction(arguments);
                    Ext.OfflineAjax.registry[this.offlineAjaxRegistryIndex].isDispatched = true;
                    Ext.Registry.setArray("ajaxstack", Ext.OfflineAjax.registry);
                };
                AjaxRequest(requestObj);
            }
        }
    },
    
    
    // Starts the request loop
    startRequestLoop: function() {
    
        // Add overall request intervall
        if (Ext.isArray(Ext.OfflineAjax.registry) && Ext.OfflineAjax.registry.length > 0) {
            setInterval(Ext.OfflineAjax.request, Ext.OfflineAjax.interval * 1000);
        }
    }
};
Ext.OfflineAjax.startRequestLoop();