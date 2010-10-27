/**
 * Here, you can set some preferences for the runtime
 * control of the Extanium framework.
 */
 
// General debugging (En- or disables debug output generally
Ext.enableDebugging = true;

// Visual debugging (Shows alert dialogs on device if activated)
Ext.enableVisualDebugging = true;

// Debug logging severity
// Possible values: info, debug, warn
Ext.debugLogLevel = Ext.LOGLEVEL_DEBUG;

// Enable application localization
// Simply add more files to Localization folder with schema $langname.js (e.g. en.js)
Ext.enableLocalization = true;

// Set a static window orientation (auto-applied to any Ext.MetricsMgr managed window)
// See Extanium/MetricsMgr.js -> Ext.Metrics class for more details.
// Simply add windows by Ext.MetricsMgr.addWindow(wnd);
Ext.MetricsMgr.setStaticOrientation(Ext.Metrics.PORTRAIT);
Ext.Metrics.standardPortrait = true;

// Set the standard screen resolution width and height, the app was designed for
// Ext.Metrics.standardWidth = 320;
// Ext.Metrics.standardHeight = 480;

// When autoscaling is activated, all elements managed by Ext.MetricsMgr will
// be scaled on application level(!) dynamically if the screen resolution is
// different on other devices. Simply call Ext.MetricsMgr.add(uiElement) to manage elements.
Ext.Metrics.enableAutoScaling = true;

// Offline Ajax request try interval in seconds
Ext.OfflineAjax = 10;

// Load the localization
Ext.loadLocalization();