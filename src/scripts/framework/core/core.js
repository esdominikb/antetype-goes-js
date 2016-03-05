var nil = nil ? nil : null;

/**
 *
 * @constructor
 */
function ANTETYPE_JS_CORE () {
    this.commands = new ANTETYPE_CORE_COMMANDS(this);
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




