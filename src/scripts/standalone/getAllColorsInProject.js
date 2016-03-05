/*
 command aufrufen
 */

(function (antetype, utils) {

    var foundColors = antetype.commands.getAllColorsInProject();
    log(foundColors);

})(new ANTETYPE_JS_CORE(), new ANTETYPE_UTILS());
