/*
 command aufrufen
 */

(function (antetype, utils) {

    var colors = [];

    var addColorToArray = function(color){
        if(colors.indexOf(color) === -1) {
            colors.push(color);
        }
    };

    antetype.commands.searchForSomethingInProject(function(cell){
        var bgColor = String(cell.backgroundColor().rgbaString());
        var borderBottomColor = String(cell.borderBottomColor().rgbaString());

        //TODO check for other properties

        log('BOTTOMCOLOR ' + borderBottomColor);
        addColorToArray(bgColor);
    });

})(new ANTETYPE_JS_CORE(), new ANTETYPE_UTILS());
