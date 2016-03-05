var nil = nil ? nil : null;

/**
 *
 * @constructor
 */
function ANTETYPE_JS_CORE () {
    this.commands = ANTETYPE_CORE_COMMANDS_FACTORY.getInstance(this);
    this.utils = ANTETYPE_UTILS_FACTORY.getInstance();
}

/**
 *
 */
var ANTETYPE_JS_CORE_FACTORY = {
    __instance: false,
    getInstance: function(){
        if (this.__instance == false) {
            this.__instance = new ANTETYPE_JS_CORE();
        }
        return this.__instance;
    }
};

/**
 *
 */
ANTETYPE_JS_CORE.prototype.selectionController = selectionController;

/**
 *
 */
ANTETYPE_JS_CORE.prototype.screenChangeManager = screenChangeManager;

/**
 *
 */
ANTETYPE_JS_CORE.prototype.document = document;

/**
 *
 */
ANTETYPE_JS_CORE.prototype.project = document.project();

/**
 * Array of selected Objecs as NSArray
 * @return {*}
 */
ANTETYPE_JS_CORE.prototype.getSelectedObjects = function () {
    return this.selectionController.selectedObjects();
};

/**
 * get all screens
 * @return {*}
 */
ANTETYPE_JS_CORE.prototype.getAllScreens = function () {
    return this.project.orderedScreens();
};

/**
 * get current  Screen
 * @return {*} GDScreen
 */
ANTETYPE_JS_CORE.prototype.getCurrentScreen = function () {
    return this.selectionController.currentScreen();
};

/**
 * get selected Screens
 * @return {*}
 */
ANTETYPE_JS_CORE.prototype.getSelectedScreens = function () {
    return this.selectionController.selectedScreens();
};

/**
 *
 * @return {*}
 */
ANTETYPE_JS_CORE.prototype.countSelectedObjects = function () {
    return this.getSelectedObjects().length();
};




