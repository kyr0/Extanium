/**
 * @class Ext.WebView
 * @singleton
 * 
 * <p>
 * This class allows outstanding 3D / GL implementations
 * to become reality inside of Titanium by wrapping WebGL
 * in an elastic WebView and allowing bidirectional data
 * piping.
 * </p>
 *  
 * <pre>
 *  var wWnd = W(Ti.UI.createWindow({
 *           modal: true,
 *           title: 'GL Window'
 *       }));
 *       
 *       
 *       // Test WebView
 *       var wview = new Ext.WebView({
 *           jsUrl: 'Components/GL/Init.js',
 *           initParams: {
 *               name: 'Aron!'
 *           },
 *           onReady: function() {
 *               
 *               // Send data
 *               this.sendData({name: 'Aron'});
 *           },
 *           receivedData: function(data) {
 *           
 *               //Ext.debug("Ext received data from WebGL context");
 *               
 *               for (name in data) {
 *                   //Ext.debug(name + " : " + data[name]);
 *               }
 *           }
 *       });
 *       wWnd.add(wview.getView());
 *       wWnd.show();
 * </pre>
 *
 * @author Aron Homberg
 * @license MIT license
 */
Ext.WebView = Ext.extend(Object, {

    /**
     * Specifies the HTML file used for bootstrapping the WebView. 
     * By default: Extanium/WebViewBootstap.html 
     * @cfg {String} 
     */ 
    bootstrapUrl: 'Extanium/WebViewBootstrap.html',

    
    /**
     * Specified the javascript to bootstrap the WebView environment.
     * By default: Extanium/WebViewBootstrap.js 
     * @cfg {String} 
     */
    bootstrapJsUrl: 'Extanium/WebViewBootstrap.js',


    /**
     * The internal managed WebView instance 
     * @type {Ti.Ui.WebView}
     */
    webview: null,
    
    
    // Translations
    trErrorIncludeFileNotFound: 'The file to include could not be found',

    
    // Constructs the WebView
    constructor: function(cfg) {
    
        // Method overrides
        Ext.apply(this, cfg);
        
        // Prepare WebView's config
        var webviewConfig = {};
        for (param in cfg) {
            if (Ext.isPrimitive(cfg[param])) {
                webviewConfig[param] = cfg[param];
            }
        }
        
        // Overlay bootstrap html
        Ext.apply(webviewConfig, {
            url: this.bootstrapUrl
        });
        
        // Create the web view instance
        this.webview = C(Ti.UI.createWebView(webviewConfig));
        
        // Listen to data received event
        Ti.App.addEventListener('wvdataTransmitted', function(data) {
        
            // Call inner-scope function override
            this.receivedData(JSON.parse(data.data));
            
        }.createDelegate(this));
        
        // Listen to glinclude command event
        Ti.App.addEventListener('wvincludeCmd', function(data) {
        
            // Thru-context script injection
            this.include(data.url);
            
            // Set include load flag
            this.eval('window.' + data.toggle + ' = true;');
            
        }.createDelegate(this));
        
        // On load of the webview, provide configuration
        this.webview.addEventListener('load', function() {
        
            // Include main user script module containing the 
            // initGL()-function override.
            if (Ext.isDefined(cfg.jsUrl)) {
                this.include(cfg.jsUrl);
            } else {
                Ext.debug('You may set the jsUrl attribute in your Ext.WebView config thats points to a javascript file which contains a Web.init function!');
            }
        
            // Include inner bootstrap
            this.include(this.bootstrapJsUrl);
            
            // Provide initGL()-params if set
            if (Ext.isDefined(cfg.initParams)) {
                Ext.apply(webviewConfig, {initParams: JSON.stringify(cfg.initParams)});
            } else {
                Ext.apply(webviewConfig, {initParams: '{}'});
            }
            
            // Inject load flag and config
            this.eval('window.WebViewConfig = ' + JSON.stringify(webviewConfig) + ';')
            this.eval('window.viewReadyLoaded = true;');
            
            // Call onready override
            this.onReady();
            
        }.createDelegate(this));
        
        
        
        return this;
    },
    
    
    /**
     * Called if GL context is ready
     * You may override this method.
     * @return {void}
     */
    onReady: function() {},
    
    
    /**
     * Processes data that were received.
     * You may override this method.
     * 
     * @param {Object} data Received data
     * @return {void}
     */
    receivedData: function(data) {
        // You may override this method.
    },
    
    
    /**
     * Returns the titanium view
     * @return {Ti.UI.WebView} Titanium WebView instance
     */
    getView: function() {
        return this.webview;
    },
    
    
    /**
     * Sends data to the webview scope
     *
     * @param {Object} data Data to transmit
     * @return {void}
     */
    sendData: function(data) {
    
        // Fire event
        Ti.App.fireEvent('wvdataReceived', {data: JSON.stringify(data)});
    },
     
    
    
    /**
     * Evaluates the given code in the webview
     * @param {String} code Javascript code
     * @return {Mixed} Return value
     */
    eval: function(code) {
        return this.webview.evalJS(code);        
    },
    
    
    /**
     * Loads some JS into the WebView
     * @param {String} url Javascript url
     * @return {void}
     */
    include: function(url) {
    
        try {
            var jsCode = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, url).read().text;
        } catch (e) {
            Ext.debug(this.trErrorIncludeFileNotFound + ': ' + url);
        }
        this.eval(jsCode);
    },
    
    
    /**
     * Shows the inner WebView instance
     * @return {void}
     */
    show: function() {
        this.webview.show();
    },
    
    
    /**
     * Hides the inner WebView instance
     * @return {void}
     */
    hide: function() {
        this.webview.hide();
    }
});