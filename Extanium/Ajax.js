/**
 * @class Ext.Ajax
 *
 * <p>
 * The Ajax class implements a lazy configurable AJAX wrapper in style<br />
 * of the ExtJS framework.
 * </p>
 *
 * <p>
 * By calling new Ext.Ajax().request(cfg) or the global function AjaxRequest(cfg) <br />
 * you can specify all needed parameters. By assigning the success() or failure()<br />
 * methods you get the results.
 * </p> 
 *
 * <p>
 * Possible configuration:
 * </p>
 *
 * <p>
 * <pre>
 * new Ext.Ajax().request({
 *     url: '',
 *     success: function(result) {},
 *     failure: function() {},
 *     headers: { // Special HTTP request headers like X-*
 *         X-Requested-With: 'Extanium'
 *     },
 *     params: { // HTTP POST parameters
 *         user: 'foo',
 *         password: 'bar'
 *     }, // OR INSTEAD OF params!! data: 'ABC' for plain data sending
 *     timeout: 5, // In seconds
 *     method: 'POST', // Which HTTP method to use?
 *     json: true, // Parse incomming text-result automatically and provide result.json object
 *     async: true, 
 *     secure: false // HTTPS cert checking
 * });
 * </pre>
 * </p>
 *
 * <p>
 * <b>The example above shows the default conifugration.</b>
 * </p>
 *
 * <p>
 * <pre>
 * success: function(result) {
 *     Ext.debug(result.data);
 *     Ext.debug(result.xml);
 *     Ext.debug(result.text);
 *     Ext.debug(result.json); // Only if json: true is defined (provides auto-deserialization)
 * } 
 * </pre>
 * </p>
 */
Ext.Ajax = Ext.extend(Object, {

    
    // HTTP client instance
    httpClient: null,
    
    
    // Was the request already dispatched?
    alreadyDispatched: false,
    
    
    // Request configuration
    cfg: null,
    
    
    /**
     * <p>
     * Configures and starts a HTTP AJAX-request
     * </p>
     *
     * <p>
     * A request configuration object may contain:
     * </p>
     *
     * <p>
     * <pre>
     * new Ext.Ajax().request({
     *     url: '',
     *     success: function(result) {},
     *     failure: function() {},
     *     headers: { // Special HTTP request headers like X-*
     *         X-Requested-With: 'Extanium'
     *     },
     *     params: { // HTTP POST parameters
     *         user: 'foo',
     *         password: 'bar'
     *     }, // OR INSTEAD OF params!! data: 'ABC' for plain data sending
     *     timeout: 5, // In seconds
     *     method: 'POST', // Which HTTP method to use?
     *     json: true, // Parse incomming text-result automatically and provide result.json object
     *     async: true, 
     *     secure: false // HTTPS cert checking
     * });
     * </pre>
     * </p>
     *
     * @param {Object} cfg Configuration of a request
     * @return {Ti.Network.HttpClient|Boolean} HTTP client instance or false
     */
    request: function(cfg) {
    
        // Return false if device is offline
        if (!Titanium.Network.online) {
            return false;
        }
    
        // Create HTTP client instance
        this.httpClient = Ti.Network.createHTTPClient();
        
        // Evaluate JSON request configuration
        var isJsonRequest = false;
        if (Ext.isDefined(cfg.json) && cfg.json === true) {
            isJsonRequest = true;
        }
        
        // Evaluates SSL cert checking
        if (Ext.isDefined(cfg.secure) && cfg.secure === true) {
            this.httpClient.validatesSecureCertificate = true;
        }
        
        // Success method override
        if (Ext.isDefined(cfg.success) && Ext.isFunction(cfg.success)) {
            this.success = cfg.success;
        }
        
        // Failure method override
        if (Ext.isDefined(cfg.failure) && Ext.isFunction(cfg.failure)) {
            this.failure = cfg.failure;
            
            // Add error handler
            var thiz = this;
            this.httpClient.onerror = function() {
                
                // Only add to OfflineAjax-Stack if network is not available
                if (!Titanium.Network.online) {
                    Ext.OfflineAjax.register(thiz.cfg);
                }
                thiz.failure(arguments);
            };
        }
        
        // Evaluate headers to setRequestHeader()
        var headers = {};
        if (Ext.isDefined(cfg.headers) && Ext.isObject(cfg.headers)) {
            headers = cfg.headers;
            
            // Set request headers
            this.httpClient.setRequestHeader(headers);
        }
        
        // Evaluate data to send()
        var sendData = null;
        if (Ext.isDefined(cfg.params)) {
            sendData = cfg.params;
        }
        
        // Evaluate timeout (Default: 10 seconds)
        var timeout = 10000;
        if (Ext.isDefined(cfg.timeout) && Ext.isNumber(cfg.timeout)) {
            timeout = cfg.timeout;
            
            // Set timeout
            this.httpClient.setTimeout(timeout);
        }
        
        // Evaluate synchronous or asynchronous calling
        var async = false;
        if (Ext.isDefined(cfg.async) && Ext.isBoolean(cfg.async)) {
            async = cfg.async;
        }
        
        // Evaluate the HTTP method
        var method = 'GET';
        if (Ext.isDefined(cfg.method) && Ext.isString(cfg.method)) {
            method = cfg.method;
        }
        
        // Evaluate the url
        var url = '';
        if (Ext.isDefined(cfg.url) && Ext.isString(cfg.url)) {
            url = cfg.url;
        }
        
        // Fatal error if URL is not set!
        if (url === '') {
            throw Exception('You should at least set an url if you want to do AJAX requests!');
        }
        
        // Add ready state handler
        var thiz = this;
        this.httpClient.onreadystatechange = function() {
        
            // LOAD && 200 OK
            if (thiz.httpClient.readyState == 4 && thiz.httpClient.status == 200 
                && thiz.alreadyDispatched != true) {
            
                if (Ext.isDefined(thiz.httpClient.responseText) &&
                    thiz.httpClient.responseText.length > 0) {
                    
                    var data = {
                        text: thiz.httpClient.responseText,
                        data: thiz.httpClient.responseData,
                        xml: thiz.httpClient.responseXml
                    };
                
                    // JSON hook
                    if (isJsonRequest) {
                        data.json = JSON.parse(data.text);
                    }
            
                    // Call the success method with data
                    thiz.success(data);
                    
                    // Set dispatch flag
                    thiz.alreadyDispatched = true;
                }
            }
        };
        
        
        // Open request
        this.httpClient.open(method, url, async);
        
        // Send request
        if (sendData == null) {
            sendData = cfg.data;
        }
        this.httpClient.send(sendData);
        
    },
    
    
    /*
     * This method will be called when a AJAX request successes.<br />
     * You may override this method by success: function() {} config.
     *
     * @param {Object} data Data object holding the attributes text, data, xml and json if json: true was configured!
     * @return {void}
     */
    success: function(data) {
        Ext.log('You may override the success() method by configuration.', Ext.LOGLEVEL_DEBUG);
    },
    
    
    /**
     * This method will be called when a AJAX request fails.<br />
     * You may override this method by failure: function() {} config.
     * 
     * @return {void}
     */
    failure: function() {
    
        Ext.log('You may override the failure() method by configuration.');
        Ext.log('An AJAX-Error occurted.', Ext.LOGLEVEL_DEBUG);
    },
    
    
    /**
     * Aborts a request if sent
     * @return {void}
     */
    abort: function() {
        if (this.httpClient != null) {
            this.httpClient.abort();
        }
    }
});

/**
 * Function to call servers by Ajax/HTTP
 *
 * @param {Object} cfg Ajax instance configuration
 * @return {Ext.Ajax} Ajax object instance
 */
var AjaxRequest = function(cfg) {
    var ajax = new Ext.Ajax();
    ajax.request(cfg);
    return ajax;
}
