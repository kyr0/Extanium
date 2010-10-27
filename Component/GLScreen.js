/**
 * @class Ext.Components.GLScreen
 * 
 * Implements the example of a GL window.
 */
Ext.createCmp('GLScreen', {
   
   
    // Configuration
    xtype: 'window',
    modal: true,
    navBarHidden: true,
       
    /**
     * Renders the 3D area
     * @return {void}
     */
    render: function() {
        
        // Test GLView
        var glview = new Ext.WebView({
            jsUrl: 'Component/WebGL/Init.js',
            initParams: {
                name: 'Aron!'
            },
            onReady: function() {
                
                //Ext.debug("onReady");
                
                // Send data
                //this.sendData({name: 'Aron'});
            },
            receivedData: function(data) {
            
                //Ext.debug("Ext received data from WebView context");
                
                //for (name in data) {
                //    Ext.debug(name + " : " + data[name]);
                //}
            }
        });
        
        glview.getView().width = '100%';
        glview.getView().height = '100%';
        
        this.cmp.add(glview.getView());
    }
});