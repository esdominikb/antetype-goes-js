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


/**
 * dynamic function to loop through all screen elements.
 * useful for global fonts, colors,...
 */
ANTETYPE_CORE_COMMANDS.prototype.searchForSomethingInProject = function (callback) {
    // search for screens
        // iterate through screens
            // iterate through cells
                // call callback

    var screens = this.core.getScreens();
    var colors = [];


    var addColorToArray = function(color){
        //log(typeof color);
        //if(!colors.indexOf(color)){
            colors.push(color);
        //};

    };

    utils.forEach(screens, function(screen){
        var cells = screen.deepOrderedComponents();

        utils.forEach(cells, function(cell){
            var bgColor = cell.backgroundColor().hex();
            addColorToArray(bgColor);
        });

        log(colors);

    });


};
