/*
 command aufrufen
 */


(function (antetype) {

    var foundColors = antetype.commands.getAllColorsInProject();
    log(foundColors);

})(ANTETYPE_JS_CORE_FACTORY.getInstance());
