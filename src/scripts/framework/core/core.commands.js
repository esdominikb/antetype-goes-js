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
ANTETYPE_CORE_COMMANDS.prototype.setTextForSelectedObjects = function (text, applyToAllCells) {
    var core = this.core;

    var command = this._createCommand('JSSetTextCommandForSelection', {
        execute: function () {

            utils.forEach(core.getSelectedObjects(), function (obj) {
                if (applyToAllCells) {
                    utils.forEach(obj.deepOrderedComponents(), function (comp) {
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
