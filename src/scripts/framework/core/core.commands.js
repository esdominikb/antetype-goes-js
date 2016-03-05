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
            utils.forEach(core.getSelectedObjects(), function (i, obj)
            {
                //Check if we apply command to all nested cells
                //Or just to the selected cell without applying changes to nested childs
                if (applyToAllCells)
                {
                    //Loop all nested childs
                    utils.forEach(obj.deepOrderedComponents(), function (j, comp)
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
 * Ddynamic function to loop through all screen elements.
 * useful to get project fonts, colors and so on
 * @param checkStates Should states of a cell also be checked?
 * @param callback Callback function that logic is called for each cell
 */
ANTETYPE_CORE_COMMANDS.prototype.searchForSomethingInProject = function (checkStates, callback)
{
    //Get all screens
    var screens = this.core.getAllScreens();

    //Loop all screens
    utils.forEach(screens, function(i, screen)
    {
        //Get all cells including all deeper nested cells
        var cells = screen.deepOrderedComponents();

        //Loop all cells and call defined cell callback logic
        utils.forEach(cells, function(j, cell)
        {
            if(checkStates)
            {
                utils.forEach(cell.states().allObjects(), function(k, state) {
                    callback(cell, state)
                });
            }
            else
            {
                callback(cell);
            }
        });
    });
};

/**
 * Get all colors used in all screens
 * @returns {Array}
 */
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
    this.core.commands.searchForSomethingInProject(true, function(cell, state)
    {
        var cellColors = {};

        if(state)
        {
            cellColors = {
                "backgroundColor": String(cell.valueForKey_inState_("backgroundColor", state).rgbaString()),
                "borderTopColor": String(cell.valueForKey_inState_("borderTopColor", state).rgbaString()),
                "borderRightColor": String(cell.valueForKey_inState_("borderRightColor", state).rgbaString()),
                "borderBottomColor": String(cell.valueForKey_inState_("borderBottomColor", state).rgbaString()),
                "borderLeftColor":String(cell.valueForKey_inState_("borderLeftColor", state).rgbaString()),
                "textColor": String(cell.valueForKey_inState_("textColor", state).rgbaString()),
                "textShadowColor": String(cell.valueForKey_inState_("textShadowColor", state).rgbaString()),
                "dropShadowColor": String(cell.valueForKey_inState_("dropShadowColor", state).rgbaString()),
                "innerShadowColor": String(cell.valueForKey_inState_("innerShadowColor", state).rgbaString())
            };
        }
        else {
            cellColors = {
                "backgroundColor": String(cell.backgroundColor().rgbaString()),
                "borderTopColor": String(cell.borderBottomColor().rgbaString()),
                "borderRightColor": String(cell.borderRightColor().rgbaString()),
                "borderBottomColor": String(cell.borderBottomColor().rgbaString()),
                "borderLeftColor": String(cell.borderLeftColor().rgbaString()),
                "textColor": String(cell.textColor().rgbaString()),
                "textShadowColor": String(cell.textShadowColor().rgbaString()),
                "dropShadowColor": String(cell.dropShadowColor().rgbaString()),
                "innerShadowColor": String(cell.innerShadowColor().rgbaString())
            };
        }

        //Push all colors from cellColor set
        for(var cellColor in cellColors)
        {
            addColorToArray(cellColors[cellColor]);
        }
    });

    return colorResultSet;
};

/**
 * Get all fonts used in all screens
 * @returns {Array}
 */
ANTETYPE_CORE_COMMANDS.prototype.getAllFontsInProject = function ()
{
    //Hold the final color result set without color duplicates
    var fontResultSet = {};

    //Helper function to push colors in an array without generating duplicates
    var addFontSetToArray = function(family, fontSet)
    {
        //log("check " + fontResultSet[family]);
        if(typeof fontResultSet[family] === 'undefined') {
            fontResultSet[family] = [];
        }

        if(fontResultSet[family].indexOf(fontSet) === -1)
            fontResultSet[family].push(fontSet);
    };

    //Loop all cells in project and get colors for defined properties for cells in all states
    this.core.commands.searchForSomethingInProject(true, function(cell, state)
    {
        var cellFontProperties = {},
            family;

        if(state)
        {
            cellFontProperties = {
                "font-family": String(cell.valueForKey_inState_("textFont", state).fontName()),
                "font-size": String(cell.valueForKey_inState_("textFont", state).pointSize() + 'px'),
                "line-height": (String(cell.valueForKey_inState_("textLineHeightMultiply", state)) === "YES") ? String(cell.valueForKey_inState_("textLineHeight", state)) : String(cell.valueForKey_inState_("textLineHeight", state)) + 'px',
                "color": String(cell.valueForKey_inState_("textColor", state).rgbaString())
            };

            family = String(cell.valueForKey_inState_("textFont", state).familyName());
        }
        else {
            cellFontProperties = {
                "font-family": String(cell.textFont().fontName()),
                "font-size": String(cell.textFont().pointSize() + 'px'),
                "line-height": (String(cell.textLineHeightMultiply()) === "YES") ? String(cell.textLineHeight()) : String(cell.textLineHeight()) + 'px',
                "color": String(cell.textColor().rgbaString())
            };

            family = String(cell.textFont().familyName());
        }



        //Push all colors from cellColor set
        addFontSetToArray(family, JSON.stringify(cellFontProperties));
    });

    return fontResultSet;
};