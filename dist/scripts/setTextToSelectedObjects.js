var _log = log.bind(this);

/**
 *
 * @param message
 */
var log = function(message){
    console.log.apply(this, arguments);
};

/**
 * enable default web javascript console.
 * could be used later on to have an overlay console in antetype for javascript
 * @type {{log: Function}}
 */
var console = {
    log: function () {
        if (arguments.length > 1) {
            _log('#AntetypeJS : ' + JSON.stringify(arguments));
        } else {
            _log('#AntetypeJS : ' + arguments[0]);
        }
    }
};

/**
 *
 * @constructor
 */
function ANTETYPE_UTILS () {
    console.log('generate ANTETYPE_UTILS');
};

/**
 *
 * @param obj
 * @param iterator
 */
ANTETYPE_UTILS.prototype.forEach = function (collection, iterator) {
    for (var i = 0; i < collection.length(); i++) {
        iterator(i, collection[i]);
    }
};
var utils = new ANTETYPE_UTILS();

/**
 *
 * @param antetype_core
 * @constructor
 */
function ANTETYPE_CORE_COMMANDS (antetype_core) {
    this.core = antetype_core;
}

/**
 *
 * @private
 * @param commandName
 * @param commandDefinition
 * @return {*}
 */
ANTETYPE_CORE_COMMANDS.prototype._createCommand = function (commandName, commandDefinition) {
    var core = this.core;
    var extendedMethods = {
        'execute': function () {
            // modifiy model here
        },
        'executeGUI': function () {
            core.screenChangeManager.rebuildRenderObjects();
        },
        'undoGUI': function () {
            this.executeGUI();
        }
    };

    for (var methodName in commandDefinition) {
        extendedMethods[methodName] = commandDefinition[methodName];
    }

    defineClass(commandName + " < GDCommand", extendedMethods);
    return eval(commandName).command();
};

/**
 * set Text to Selected Objects.
 * @param text text to set
 * @param applyToAllCells flag if text should be set to all Cells of selected objects
 */
ANTETYPE_CORE_COMMANDS.prototype.setTextToSelectedObjects = function (text, applyToAllCells) {
    var core = this.core;

    var command = this._createCommand('JSSetTextCommandForSelection', {
        execute: function () {

            utils.forEach(core.getSelectedObjects(), function (i, obj) {
                if (applyToAllCells) {
                    utils.forEach(obj.deepOrderedComponents(), function (j, comp) {
                        var _text = NSAttributedString.alloc().initWithString_(text + comp.name());
                        comp.setValue_forKey_inState_(_text, "textAttributedString", nil);
                    });
                } else {
                    var _text = NSAttributedString.alloc().initWithString_(text + obj.name());
                    obj.setValue_forKey_inState_(_text, "textAttributedString", nil);
                }

            });
        }
    });

    document.commandManager().executeCommand(command);
};


/**
 * dynamic function to loop through all screen elements.
 * useful for global fonts, colors,...
 */
ANTETYPE_CORE_COMMANDS.prototype.searchForSomethingInProject = function (callback) {
    // search for screens
        // iterate through screens
            // iterate through cells
                // call callback

    var screens = this.core.getAllScreens();


    utils.forEach(screens, function(i, screen){
        var cells = screen.deepOrderedComponents();

        utils.forEach(cells, function(j, cell){
            callback(cell);
        });
    });


};

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





/*
 command aufrufen
 */


(
/**
 *
 * @param antetype
 * @param utils
 */
function (antetype, utils) {


    // set text only for first child in selected objects
    //antetype.commands.setTextToSelectedObjects('hah22a');

    // set text for all cells of selected objects
    antetype.commands.setTextToSelectedObjects('hah22a', true);

})(new ANTETYPE_JS_CORE(), new ANTETYPE_UTILS());
