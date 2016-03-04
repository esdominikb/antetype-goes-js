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
 * @return {*}
 */
ANTETYPE_JS_CORE.prototype.getSelectedObjects = function () {
    return this.selectionController.selectedObjects();
};

/**
 *
 * @return {*}
 */
ANTETYPE_JS_CORE.prototype.countSelectedObjects = function () {
    return this.getSelectedObjects().length();
};




