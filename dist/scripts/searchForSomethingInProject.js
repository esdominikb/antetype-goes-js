/**
 * enable default web javascript console.
 * could be used later on to have an overlay console in antetype for javascript
 * @type {{log: Function}}
 */
var console = {
    log: function () {
        if (arguments.length > 1) {
            log(JSON.stringify(arguments));
        } else {
            log(arguments[0]);
        }
    }
};

/**
 *
 * @constructor
 */
function ANTETYPE_UTILS () {
};

/**
 *
 * @param obj
 * @param iterator
 */
ANTETYPE_UTILS.prototype.forEach = function (obj, iterator) {
    for (var i = 0; i < obj.length(); i++) {
        iterator(obj[i]);
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
ANTETYPE_CORE_COMMANDS.prototype.setTextToSelectedObjects = function (text, applyToAllCells)
{
    //Hold core functions in this scope
    var core = this.core;

    //Create a new command with execution logic
    var command = this._createCommand('JSSetTextCommandForSelection', {

        execute: function ()
        {
            //Loop all selected objects/cells
            utils.forEach(core.getSelectedObjects(), function (obj)
            {
                //Check if we apply command to all nested cells
                //Or just to the selected cell without applying changes to nested childs
                if (applyToAllCells)
                {
                    //Loop all nested childs
                    utils.forEach(obj.deepOrderedComponents(), function (comp)
                    {
                        var _text = NSAttributedString.alloc().initWithString_(text + comp.name());
                        comp.setValue_forKey_inState_(_text, "textAttributedString", nil);
                    });
                }
                else
                {
                    //Just set to selected top level cell
                    var _text = NSAttributedString.alloc().initWithString_(text + obj.name());
                    obj.setValue_forKey_inState_(_text, "textAttributedString", nil);
                }

            });
        }
    });

    //Call command
    document.commandManager().executeCommand(command);
};


/**
 * dynamic function to loop through all screen elements.
 * useful for global fonts, colors,...
 */
ANTETYPE_CORE_COMMANDS.prototype.searchForSomethingInProject = function (callback)
{
    //Get all screens
    var screens = this.core.getScreens();

    //Loop all screens
    utils.forEach(screens, function(screen)
    {
        //Get all cells including all deeper nested cells
        var cells = screen.deepOrderedComponents();

        //Loop all cells and call defined cell callback logic
        utils.forEach(cells, function(cell)
        {
            callback(cell);
        });
    });
};

ANTETYPE_CORE_COMMANDS.prototype.getAllColorsInProject = function ()
{
    //Hold the final color result set without color duplicates
    var colorResultSet = [];

    //Helper function to push colors in an array without generating duplicates
    var addColorToArray = function(color)
    {
        if(colorResultSet.indexOf(color) === -1)
            colorResultSet.push(color);
    };

    //Loop all cells in project and get colors for defined properties for cells in all states
    this.core.commands.searchForSomethingInProject(function(cell)
    {
        var cellColors = {
            "bgColor": String(cell.backgroundColor().rgbaString()),
            "borderTopColor": String(cell.borderBottomColor().rgbaString()),
            "borderRightColor": String(cell.borderRightColor().rgbaString()),
            "borderBottomColor": String(cell.borderBottomColor().rgbaString()),
            "borderLeftColor": String(cell.borderLeftColor().rgbaString()),
            "textColor": String(cell.textColor().rgbaString()),
            "textShadowColor": String(cell.textShadowColor().rgbaString()),
            "dropShadowColor": String(cell.dropShadowColor().rgbaString()),
            "innerShadowColor": String(cell.innerShadowColor().rgbaString()),
        };

        //Push all colors from cellColor set
        for(var cellColor in cellColors)
        {
            addColorToArray(cellColor);
        }
    });

    return colorResultSet;
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
ANTETYPE_JS_CORE.prototype.getScreens = function () {
    return this.project.orderedScreens();
};

/**
 *
 * @return {*}
 */
ANTETYPE_JS_CORE.prototype.countSelectedObjects = function () {
    return this.getSelectedObjects().length();
};




