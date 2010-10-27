/**
 * @class Ext.Components.MainScreen
 * 
 * Implements the main windows in tab groups.
 */
Ext.createCmp('MainScreen', {

    
    // Local reference storage
    tabGroup: null,
    saveTimeWindow: null,
    abstractionWindow: null,
    
    
    // Translation strings
    trSaveTime: 'Save time',
    trAbstraction: 'Abstraction',
    tr3D: '3D Corner!',


    create3DBtn: function() {
    
        var threeDBtn = C(Ti.UI.createButton({
            title: this.tr3D
        }));
        
        // 3D context
        threeDBtn.addEventListener('click', function() {
                
            // Show GL Screen
            Ext.Activities.Main.showGLScreen();
            
        }.createDelegate(this));
        
        return threeDBtn;
    },

    
    /**
     * Renders the save time window
     * @return {void}
     */
    renderSaveTimeWindow: function() {
    
        // Save time window
        this.saveTimeWindow = W(Ti.UI.createWindow({  
            title: "",
            backgroundColor: '#fff',
            barImage: 'Assets/logo_mobile.png',
            rightNavButton: this.create3DBtn()
        }));
        
        
        // Login screen demo
        var openLoginScreenBtn = C(Ti.UI.createButton({
            title: 'Login Screen demo',
            left: 35,
            top: 30,
            width: 250,
            height: 35
        }));
        
        // Click listener
        openLoginScreenBtn.addEventListener('click', function() {
                
            // Show login screen
            Ext.Activities.Main.showLoginScreen();
            
        }.createDelegate(this));
        
        this.saveTimeWindow.add(openLoginScreenBtn);
        
        
        // Ext.Ajax demo
        var ajaxButton = C(Ti.UI.createButton({
            title: 'Ext.Ajax demo',
            left: 35,
            top: 75,
            width: 250,
            height: 35
        }));
        
        // Click listener
        ajaxButton.addEventListener('click', function() {
                
            new Ext.Ajax().request({
                
                url: 'http://localhost/demo.php',
                params: [{name: 'username', value: 'Aron'}, 
                         {name: 'password', value: 'ABC'}],
                success: function() {
                
                    Ext.debug("AJAX success");
                    Ext.debug(arguments);
                },
                failure: function() {
                    Ext.debug("AJAX error, may change code to set url!");
                    Ext.debug(arguments);
                }
            });
            
        }.createDelegate(this));
        
        this.saveTimeWindow.add(ajaxButton);
        
        
        // Ext.Direct demo
        var directButton = C(Ti.UI.createButton({
            title: 'Ext.Direct demo (free impl)',
            left: 35,
            top: 75,
            width: 250,
            height: 35
        }));
        
        // Click listener
        directButton.addEventListener('click', function() {
                
            // Read more about Ext.Direct on ExtJS.com
            
            // Set base URL & Provider
            Ext.Direct.baseUrl = "http://localhost:80";
            Ext.Direct.loadProvider('1.0.js');

            // Call with Server API
            OTTRemote.login("aron", "testpw", function(result) {
                Ext.debug("Result: " + result);
            });
           
                                   
        }.createDelegate(this));
        
        this.saveTimeWindow.add(directButton);
        
        
        // Debug demo
        var debugButton = C(Ti.UI.createButton({
            title: 'Some debugs',
            left: 35,
            top: 120,
            width: 250,
            height: 35
        }));
        
        // Click listener
        debugButton.addEventListener('click', function() {
                
            // Only visual
            Ext.alert("Alert title", "Ext.alert(...)");
            
            // Warn log lebel
            Ext.debug("Ext.warn(...)");
            
            // Debug log lebel
            Ext.debug("Ext.debug(...)");
            
            // Info log lebel
            Ext.log("Ext.log(...)");
            
        }.createDelegate(this));
        
        this.saveTimeWindow.add(debugButton);
        
    },
    
    
    /**
     * Renders the abstraction window
     * @return {void}
     */
    renderAbstractionWindow: function() {
    
        // Abstraction window
        this.abstractionWindow = W(Ti.UI.createWindow({
            title: "",
            backgroundColor: '#fff',
            barImage: 'Assets/logo_mobile.png',
            rightNavButton: this.create3DBtn()
        }));
    },
    
    
    /**
     * Renders the tab group
     * @return {void}
     */
    renderTabGroup: function() {
    
        // Tab group
        this.tabGroup = Ti.UI.createTabGroup(); 
        
        // Save Time tab
        this.saveTimeTab = Ti.UI.createTab({
            icon: 'Assets/save_time.png',
            title: this.trSaveTime,
            window: this.saveTimeWindow
        });
        
        // Abstraction tab
        this.abstractionTab = Ti.UI.createTab({
            icon: 'Assets/abstraction.png',
            title: this.trAbstraction,
            window: this.abstractionWindow
        });

        // Add tabs
        this.tabGroup.addTab(this.saveTimeTab);  
        this.tabGroup.addTab(this.abstractionTab);  
        
        // Open tab group
        this.tabGroup.open();
    },
    
    
    /**
     * Renders the whole Main Screen UI
     * @return {void}
     */
    render: function() {
    
        // Render save time window
        this.renderSaveTimeWindow();
        
        // Render abstraction window
        this.renderAbstractionWindow();
        
        // Render tab group and tabs
        this.renderTabGroup();
    }
});