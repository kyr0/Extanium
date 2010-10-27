// Shorten namespace
window = this;

// Absolute base Ext Core class to introduce OOP
Ti.include('/Extanium/Ext.js');

// Include Extanium
Ti.include('/Extanium/Extanium.js');

// Sets some app preferences
Ext.include('/Preferences.js');

// Loads the application class
Ext.include('/Application.js');

// Construct and initialize the app runtime.
App = new App();