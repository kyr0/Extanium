/**
 * @class Ext.Components.LoginScreen
 * 
 * Implements the login screen window.
 */
Ext.createCmp('LoginScreen', {
   
    // References
    loginWindow: null,
    username: null,
    password: null,
    url: null,
    loadingView: null,
    loginRequest: null,
    isLoadingViewCreated: false,
    activityIndicator: null,
   
    // Configuration
    xtype: 'window',
    modal: true,
    backgroundColor: '#ffffff',
    barColor: '#13386c',
    navBarHidden: true,
    
    // Locales
    trTitle: 'Login',
    trUsername: 'Username:',
    trUsernameHint: 'Please enter an username',
    trPassword: 'Password:',
    trAutoLogin: 'Auto login:',
    trURL: 'URL:',
    trURLHint: 'Please enter an URL',
    trLogin: 'Login!',
    trWarning: 'Warning!',
    trUrlNotSet: 'URL wasn\t set properly.',
    trUsernameNotSet: 'Username wasn\t set properly.',
    trPasswordNotSet: 'Password wasn\t set propertly.',
    trCancel: 'Cancel',
    trLogginIn: 'Loggin in...',
    trWarning: 'Warning!',
    trYouAreOffline: 'Sorry, you\'re currently offline. Please try again later.',
    trUnknownAjaxError: 'An unknown AJAX-error occurted. Please try again later.',
    trHostNotFound: 'The hostname could not be found. URL seems to be wrong.',
    
    
    /**
     * Renders the logo of the app
     */
    renderLogo: function() {
    
        // Create image to add
        var logo = C(Ti.UI.createImageView({
            image: 'Assets/logo_mobile.png',
            center: {
                x: this.cmp.width / 2,
                y: 20
            }
        }));
        
        // Android overlay
        Ext.onAndroid(function() {
            Ext.apply(logo, {
                top: 0
            });
        });
        
        // Set title
        this.cmp.title = this.trTitle;
        
        // Add an image as logo
        this.add(logo);
    },
    
    
    /**
     * Shows the loading view, if needed creates it first
     * @return {void}
     */
    showLoadingView: function() {
    
        if (!this.isLoadingViewCreated) {
        
            // --- LOADING VIEW
            
            // Loading view
            this.loadingView = C(Ti.UI.createView({
                width: 200,
                height: 100,
                center: {
                    x: this.cmp.width / 2,
                    y: this.cmp.height / 2 
                },
                backgroundColor: '#777',
                opacity: 0.8,
                borderRadius: 10,
                zIndex: 1000
            }));
            
            // Loading indicator
            this.activityIndicator = C(Ti.UI.createActivityIndicator({
                height: 'auto',
                width: 'auto',
                left: 15,
                top: 20,
                color: '#fff',
                message: ' ' + this.trLogginIn
            }));
            this.loadingView.add(this.activityIndicator);
            
            // Cancel button
            var loadingCancelButton = C(Ti.UI.createButton({
                title: this.trCancel,
                width: 180,
                color: '#000',
                height: 35,
                top: 55,
                left: 10
            }));
            
            // Canceling of login
            loadingCancelButton.addEventListener('click', function() {
                
                // Abort login
                this.abortLogin();

            }.createDelegate(this));
            this.loadingView.add(loadingCancelButton);
                            
            // Add loading view to window
            this.add(this.loadingView);
            
            // Set creation flag
            this.isLoadingViewCreated = true;
        }
        this.loadingView.show();
        this.activityIndicator.show();
    },
    
    
    /**
     * Hides the loading view if existing
     * @return {void}
     */
    hideLoadingView: function() {
        if (this.loadingView != null) {
            this.loadingView.hide();
            this.activityIndicator.hide();
        }
    },
    
    
    /**
     * Renders the login form like
     * username and password.
     */
    renderForm: function() {
    
        var thiz = this;

        // --- URL
    
        // URL label
        var urlLabel = C(Ti.UI.createLabel({
            text: this.trURL,
            height: 'auto',
            color: '#777',
            top: 60,
            left: 35,
            width: 100
        }));
        this.add(urlLabel);
        
        // URL field
        this.url = C(Ti.UI.createTextField({
            hintText: this.trURLHint,
            height: 35,
            top: 85,
            left: 35,
            keyboardType: Titanium.UI.KEYBOARD_URL,
            returnKeyType: Titanium.UI.RETURNKEY_NEXT,
            width: 250,
            borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
        }));
        
        // Listener for the TextArea
        this.url.addEventListener('blur', function(e) {
            Ti.App.fireEvent("hideKeyboardToolbar");
        });
        this.add(this.url);
    
        // --- USERNAME
    
        // Username label
        var usernameLabel = C(Ti.UI.createLabel({
            text: this.trUsername,
            height: 'auto',
            color: '#777',
            top: 130,
            left: 35,
            width: 100
        }));
        this.add(usernameLabel);
        
        // Username field
        this.username = C(Ti.UI.createTextField({
            hintText: this.trUsernameHint,
            height: 35,
            top: 155,
            left: 35,
            width: 250,
            returnKeyType: Titanium.UI.RETURNKEY_NEXT,
            borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
        }));
        
        // Listener for the TextArea
        this.username.addEventListener('blur', function(e) {
            Ti.App.fireEvent("hideKeyboardToolbar");
        });
        this.add(this.username);
        
        // --- PASSWORD
        
        // Password label
        var passwordLabel = C(Ti.UI.createLabel({
            text: this.trPassword,
            height: 'auto',
            color: '#777',
            top: 200,
            left: 35,
            width: 100
        }));
        this.add(passwordLabel);
        
        // Password field
        this.password = C(Ti.UI.createTextField({
            height: 35,
            top: 225,
            left: 35,
            width: 250,
            returnKeyType: Titanium.UI.RETURNKEY_DONE,
            passwordMask: true,
            borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
        }));
        
        // Listener for the TextArea
        /*
        this.password.addEventListener('blur', function(e) {
            thiz.password.blur();
        });
        */
        this.add(this.password);
        
        // --- LOGIN BUTTON
        
        var loginButton = C(Ti.UI.createButton({
            title: this.trLogin,
            left: 35,
            top: 290,
            width: 250,
            height: 35,
            color: '#13386c'
        }));
        
        // Handle login button clicks
        loginButton.addEventListener('click', this.validateForm.createDelegate(this));
        this.add(loginButton);
        
        // Pre-fill form data from Registry
        this.loadForm();
    },
    
    
    /**
     * Loads the form data from the persistent app registry
     * and pre-fills the form fields. Afterwards it validates 
     * the form and sends a login request to the server if 
     * validation returns true and autologin-flag is set to true.
     *
     * @return {void}
     */
    loadForm: function() {
    
        // Load Registy / Properties data
        
        // URL preference
        var url_preference = Ext.Registry.getString('url_preference');
        if (Ext.isDefined(url_preference) && url_preference != null) {
            this.url.value = url_preference;
        }
        
        // Username preference
        var username_preference = Ext.Registry.getString('username_preference');
        if (Ext.isDefined(username_preference) && username_preference != null) {
            this.username.value = username_preference;
        }
        
        // Password preference
        var password_preference = Ext.Registry.getString('password_preference');
        if (Ext.isDefined(password_preference) && password_preference != null) {
            this.password.value = password_preference;
        }
    },
    
    
    /**
     * Validates the form data
     *
     * @param {Boolean} isQuite May the form validation occur without any reaction? (Optional)
     * @return {Boolean} Was the validation fine?
     */
    validateForm: function() {
    
        // Check for quite mode
        var quite = false;
        
        if (Ext.isDefined(arguments[0]) && arguments[0] == true) {
            quite = true;
        }
    
        var url = this.url.value;
        var username = this.username.value;
        var password = this.password.value;
        
        // URL check
        if (!Ext.isString(url) || url.length == 0) {
            
            if (!quite) {
                Ext.alert(this.trWarning, this.trUrlNotSet);
                this.url.focus();
            }
            return false;
        }
        
        // Username check
        if (!Ext.isString(username) || username.length == 0) {
            
            if (!quite) {
                Ext.alert(this.trWarning, this.trUsernameNotSet);
                this.username.focus();
            }
            return false;
        }
        
        // Password check
        if (!Ext.isString(password) || password.length == 0) {
        
            if (!quite) {
                Ext.alert(this.trWarning, this.trPasswordNotSet);
                this.password.focus();
            }
            return false;
        }
        
        // Persist new login credentials
        Ext.Registry.setString('url_preference', url);
        Ext.Registry.setString('username_preference', username);
        Ext.Registry.setString('password_preference', password);
        
        // Finally log in
        this.login();
    },
    
    
    /**
     * Renders the whole login screen.
     * @return {void}
     */
    render: function() {
        
        // Render the logo
        this.renderLogo();
    
        // Render the form
        this.renderForm();
    },
    
    
    /**
     * Starts the login procedure
     * @return {void}
     */
    login: function() {
    
        // Set Ext.Direct base url
        Ext.Direct.baseUrl = this.url.value;
        
        // Show loading indicator
        this.showLoadingView();
       
        
        // Ext.Direct definition!
        /*
        
        Ext.Direct.baseUrl = "http://192.168.1.157:100";
        Ext.Direct.loadProvider('1.0.js');

        // Call with Server API
        OTTRemote.login("aron", "testpw", function(result) {
            Ext.debug("Result: " + result);
        });
        */
        
        var thiz = this;
        setTimeout(function() {
            thiz.gotoMainScreen();
            
            
        }, 1500);
        return;
        
        // 1. Show loading indicator
        // 2. Success: Hide loading indicator & stop activity, start MainActivity
        // 3. Failure: Evaluate error, show message, focus field, hide loading indicator!
        if (Ti.Network.online == true) {
            this.loginRequest = new Ext.Ajax().request({
                
                url: this.url.value + '/mobile/api.php?action=login',
                params: [{name: 'username', value: this.username.value}, 
                         {name: 'password', value: this.password.value}],
                success: this.handleSuccess.createDelegate(this),
                failure: this.handleFailure.createDelegate(this)
            });
        } else {
            
            // Show offline warning
            Ext.alert(this.trWarning, this.trYouAreOffline);
        }
    },
    
    
    /**
     * Handles the successful login response
     *
     * @param {Object} result Result object
     * @return {void}
     */
    handleSuccess: function(result) {
        
        // Set application global flag
        App.isLoggedIn = true;
        
        // Hide loading view
        this.hideLoadingView();
        
        /*
        Ext.debug(result);
        */
        
        // Stop this activity, start MainScreen activity
        this.gotoMainScreen();
    },
    
    
    /**
     * Handles the failure login response
     * @return {void}
     */
    handleFailure: function(result) {
    
        // Hide loading view
        this.hideLoadingView();
        
        /*
        // Evaluate first error
        if (result.length > 0 && Ext.isDefined(result[0].error)) {
            
            var errorMessage = this.trUnknownAjaxError;
            switch (result[0].error) {
            
                // Host not found
                case "Not Found":
                    errorMessage = this.trHostNotFound;
                    this.url.focus();
                    break;
            }
            
            // Show error message
            Ext.alert(this.trWarning, errorMessage);
            
        } else {
        
            // Unknown AJAX error
            Ext.alert(this.trWarning, this.trUnknownAjaxError);
        }
        */
        
        // Stop this activity, start MainScreen activity
        this.gotoMainScreen();
    },
    
    
    /**
     * Aborts the login procedure
     * @return {void}
     */
    abortLogin: function() {
        
        // Hide loading view
        this.hideLoadingView();
        
        // Abort the request itself
        if (this.loginRequest != null) {
            this.loginRequest.abort();
        }
    },
    
    
    /**
     * Stops the Login-Activity and starts the Main-Activity
     * @return {void}
     */
    gotoMainScreen: function() {
    
        // Show main screen
        Ext.Activities.Main.showMainScreen();
        
        // Hide current component
        this.hide();
    }
});