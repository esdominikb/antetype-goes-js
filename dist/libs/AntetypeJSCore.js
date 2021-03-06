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
 */
var ANTETYPE_UTILS_FACTORY = {
    __instance: false,
    getInstance: function(){
        if (this.__instance == false) {
            this.__instance = new ANTETYPE_UTILS();
        }
        return this.__instance;
    }
};

/**
 *
 * @param collection
 * @param iterator
 */
ANTETYPE_UTILS.prototype.forEach = function (collection, iterator) {
    for (var i = 0; i < collection.length(); i++) {
        iterator(i, collection[i]);
    }
};

/**
 *
 * @constructor
 */
function ANTETYPE_CORE_COMMANDS (core) {
    this.core = core;
}


/**
 *
 */
var ANTETYPE_CORE_COMMANDS_FACTORY = {
    __instance: false,
    getInstance: function (core) {
        if (this.__instance == false) {
            this.__instance = new ANTETYPE_CORE_COMMANDS(core);
        }
        return this.__instance;
    }
};


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
            core.utils.forEach(core.getSelectedObjects(), function (i, obj)
            {
                //Check if we apply command to all nested cells
                //Or just to the selected cell without applying changes to nested childs
                if (applyToAllCells)
                {
                    //Loop all nested childs
                    core.utils.forEach(obj.deepOrderedComponents(), function (j, comp)
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
    var core = this.core;

    //Get all screens
    var screens = this.core.getAllScreens();

    //Loop all screens
    core.utils.forEach(screens, function(i, screen)
    {
        //Get all cells including all deeper nested cells
        var cells = screen.deepOrderedComponents();

        //Loop all cells and call defined cell callback logic
        core.utils.forEach(cells, function(j, cell)
        {
            if(checkStates)
            {
                core.utils.forEach(cell.states().allObjects(), function(k, state) {
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
    var addFontSetToArray = function(family, state, fontSet)
    {
        //log("check " + fontResultSet[family]);
        if(typeof fontResultSet[family] === 'undefined') {
            fontResultSet[family] = {};
        }

        if(typeof fontResultSet[family][state] === 'undefined') {
            fontResultSet[family][state] = [];
        }

        if(fontResultSet[family][state].indexOf(fontSet) === -1)
            fontResultSet[family][state].push(fontSet);
    };

    //Loop all cells in project and get colors for defined properties for cells in all states
    this.core.commands.searchForSomethingInProject(true, function(cell, state)
    {
        var cellFontProperties = {},
            family,
            state;
            //textShadowHorOff,
            //textShadowVerOff;

        if(state)
        {
            //if(String(cell.valueForKey_inState_("textShadow", state)) === "1")
            //{
            //    textShadowHorOff = (Number)(Math.sin(Number(cell.valueForKey_inState_("textShadowAngle", state)) * Math.PI / 180.0) * Number(cell.valueForKey_inState_("textShadowOffset", state)));
            //    textShadowVerOff = (Number)(Math.cos(Number(cell.valueForKey_inState_("textShadowAngle", state)) * Math.PI / 180.0) * Number(cell.valueForKey_inState_("textShadowOffset", state)) * (-1.0));
            //}

            cellFontProperties = {
                "font-family": String(cell.valueForKey_inState_("textFont", state).fontName()),
                "font-size": String(cell.valueForKey_inState_("textFont", state).pointSize()) + 'px',
                "line-height": (String(cell.valueForKey_inState_("textLineHeightMultiply", state)) === "1") ? String(cell.valueForKey_inState_("textLineHeight", state)) : String(cell.valueForKey_inState_("textLineHeight", state)) + 'px',
                "color": String(cell.valueForKey_inState_("textColor", state).rgbaString())
                //"text-shadow": (String(cell.valueForKey_inState_("textShadow", state)) === "0") ? 'none' : (textShadowHorOff + 'px ' + textShadowVerOff + 'px ' + String(cell.valueForKey_inState_("textShadowBlur", state))) + 'px ' + String(cell.valueForKey_inState_("textShadowColor", state).rgbaString())
            };

            family = String(cell.valueForKey_inState_("textFont", state).familyName());
        }
        else
        {
            //if(String(cell.textShadow()) === "1")
            //{
            //    textShadowHorOff = (Number)(Math.sin(cell.textShadowAngle() * Math.PI / 180.0) * cell.textShadowOffset());
            //    textShadowVerOff = (Number)(Math.cos(cell.textShadowAngle() * Math.PI / 180.0) * cell.textShadowOffset() * (-1.0));
            //}

            cellFontProperties = {
                "font-family": String(cell.textFont().fontName()),
                "font-size": String(cell.textFont().pointSize()) + 'px',
                "line-height": (String(cell.textLineHeightMultiply()) === "1") ? String(cell.textLineHeight()) : String(cell.textLineHeight()) + 'px',
                "color": String(cell.textColor().rgbaString())
                //"text-shadow": (String(cell.textShadow()) === "0") ? 'none' : (textShadowHorOff + 'px ' + textShadowVerOff + 'px ' + String(cell.textShadowBlur())) + 'px ' + String(cell.textShadowColor().rgbaString())
            };

            family = String(cell.textFont().familyName());
        }

        state = cellFontProperties["font-family"] + cellFontProperties["font-size"] + cellFontProperties["line-height"] + cellFontProperties["line-height"];

        //Push all colors from cellColor set
        addFontSetToArray(family, state, cellFontProperties);
    });

    for(var family in fontResultSet)
    {
        for(var state in fontResultSet[family])
        {
            var colors = [];

            for(var color in fontResultSet[family][state])
            {
                if(colors.indexOf(fontResultSet[family][state][color]["color"]) !== -1)
                    colors.push(fontResultSet[family][state][color]["color"]);

                if(color > 0)
                    delete fontResultSet[family][state][color];
            }

            if(colors.length > 0)
                fontResultSet[family][state][0]["color"] = colors;
        }
    }

    return fontResultSet;
};
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




