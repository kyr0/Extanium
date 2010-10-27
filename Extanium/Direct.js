/**
 * @class Ext.Direct
 * @singleton
 *
 * A free reimplementation of the ExtJS's Ext.Direct JSON-RPC protocol.<br />
 * It generates a "native" javascript API based on the server's API.<br />
 * <br />
 * <br />
 * For example a server API may look like this: (Pseudo code)
 * <br /><br />
 * <pre>
 * class Car {
 * 
 *     public open(Boolean withKey) {
 *         return "Yeeha!";
 *     }
 * }
 * </pre>
 * <br /><br />
 * You may be a lucky man if you simply could call:
 * <br /><br />
 * <pre>
 * Car.open(true, function(result) {
 *     Ext.debug(result); // Yeeha!
 * });
 * </pre>
 * <br /><br />
 * Well, with Ext.Direct, you can. ;-)
 * <br /><br />
 * For that you need an Ext.Direct server stack to be integrated in your server code.<br />
 * See http://www.sencha.com/forum/showthread.php?67992-Ext.Direct-Server-side-Stacks for the server stacks.<br />
 * <br />
 * To understand the magical seamless communication, imagine there is a JSON-RPC protocol.<br />
 * A server stack of choice generates an JSON-RPC descriptor. Called, the "Provider Description".<br />
 * This code is simply JSON and reflects your server API in an abstract manner. It may look like the<br />
 * demo Provider code you will find in DirectProvider/1.0.js.<br />
 * <br />
 * This code needs to be loaded by Ext.Direct. This happens using Ext.Direct.loadProvider(RPC-Provider-Description);<br />
 * You may also load the full description via AJAX from a remote host using Ext.Direct.fetchProvider({ajax-request-config, see Ext.Ajax});<br />
 * <br />
 * All in all, an example may look like this:<br />
 * <br />
 * <pre>
 * Ext.Direct.baseUrl = "http://localhost/CarProject";
 * Ext.Direct.fetchProvider({url: 'http://localhost/CarProject/direct.php?javascript'});
 *
 * // Call with Server API
 * Car.open(true, function(result) {
 *     Ext.debug("Result: " + result);
 * });
 * </pre>
 */
Ext.Direct = {


    /** 
     * Base url to prefix to the Ext.Direct-Ajax calls
     * @type {String} baseUrl URL to prefix to the requests
     */
    baseUrl: 'http://localhost',
    
    
    /**
     * Direct provider url provided by the provider definition 
     * and added as prefix to the baseUrl
     * @type {String} providerUrl Direct provider URL      
     */
    providerUrl: '',
    
    
    /**
     * Current transaction id
     * @type {Number} tid Transaction number
     */
    tid: 1,

    
    /**
     * Method to fetch a provider definition from a remote host (HTTP)
     * 
     * @param {String} url URL to fetch the provider JSON-RPC definition from
     * @return {void}
     */
    fetchProvider: function(ajaxConfig) {
    
        // Overlay the configuration
        Ext.apply(ajaxConfig, {
            json: false,
            success: function(result) {
                eval(result.text);
            }
        });
        
        // Do request
        new Ext.Ajax().request(ajaxConfig);
    },
    
    
    /**
     * Loads the provider definition locally
     *
     * @param {String} apiFileName Name of the API javascript file name
     * @param {void}
     */
    loadProvider: function(apiFileName) {
        Ext.include('/DirectProvider/' + apiFileName);
    },
    

    /**
     * Adds a provider to use in Ext.Direct
     *
     * @param {Object} pr A provider object definition reference
     * @return {void}
     */
    addProvider: function(pr) {
    
        // Declare the working namespace
        var scope = Ext.ns(pr.namespace);
        Ext.Direct.providerUrl = pr.url;
        
        for (className in pr.actions) {
        
            // Define class scope if not already defined
            if (!Ext.isDefined(scope[className])) {
                scope[className] = {};
            }
            
            // Walk each method and declare as function
            for (var i=0; i<pr.actions[className].length; i++) {
            
                with ({className: className,
                       methodName: pr.actions[className][i].name,
                       argLen: pr.actions[className][i].len}) {
                    
                    // Generate function
                    scope[className][methodName] = function() {
                        Ext.Direct.callRemote(className, methodName, argLen, arguments);
                    };
                }
            }
        }
        
        // Globalize remote classes
        Ext.apply(window, scope);
    },
    
    
    /**
     * Resulting call of a generative method to call the remote server<br />
     * via AJAX and reuse the resulting response to a connected handler function.
     *
     * @param {String} className Name of the class to call
     * @param {methodName} methodName Name of the method to call
     * @param {Number} argc Number of the arguments available
     * @param {Object} args Arguments set at call time
     * @return {void} 
     */
    callRemote: function(className, methodName, argc, args) {
        
        // Evaluate the function to call at result arrival time
        var resultHandleFunc = function() {};
        if (Ext.isDefined(args[argc]) && Ext.isFunction(args[argc])) {
            resultHandleFunc = args[argc];
        }
        
        // Implement RPC-calling
        //Ext.debug("Calling remote to use class: " + className + " method: " + methodName + " with " + argc + " args.");
        //Ext.debug(args[0]);
        
        var data = [];
        for (var i=0; i<args.length; i++) {
            if (Ext.isPrimitive(args[i])) {
                data.push(args[i])
            }
        }
        
        // Do request
        new Ext.Ajax().request({
        
            url: Ext.Direct.baseUrl + Ext.Direct.providerUrl,
            data: JSON.stringify({
                data: data, 
                method: methodName, 
                action: className, 
                tid: ++Ext.Direct.tid, 
                type: 'rpc'
            }),
            json: true,
            success: function(result) {
            
                // Call result function
                resultHandleFunc(result.json.result);
            },
            failure: function(error) {
                Ext.debug("An error occurted while Ext.Direct communication!");
                Ext.debug(error);
            }
        });
    }
};