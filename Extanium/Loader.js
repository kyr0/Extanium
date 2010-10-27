// --- ADAPTER INCLUDES (EXT CORE)

// Include the loader which loads the rest of the
// Ext Core files required in this project. 



// --- LIBRARY INCLUDES

// Application global variable store
Ext.include('/Extanium/Global.js');

// Application property storage wrapper
Ext.include('/Extanium/Registry.js');

// Abstract Activity class
Ext.include('/Extanium/Activity.js');

// Abstract OOP window for manager integration
Ext.include('/Extanium/Component.js');

// Abstract class for metrics calculation
Ext.include('/Extanium/MetricsMgr.js');

// Class for abstract AJAX communication
Ext.include('/Extanium/Ajax.js');

// Class for stacked AJAX communication in offline mode
Ext.include('/Extanium/OfflineAjax.js');

// Ext.Direct-mimic free implementation
Ext.include('/Extanium/Direct.js');

// Outstanding 3D programming in JavaScript
Ext.include('/Extanium/WebView.js');



// --- APPLICATION BASE CLASS INCLUDE

// Include the Application-Class 
Ext.include('/Extanium/Application.js');