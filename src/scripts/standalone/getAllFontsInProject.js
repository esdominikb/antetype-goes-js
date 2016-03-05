/*
 command aufrufen
 */

(function (antetype) {

    var foundFonts = antetype.commands.getAllFontsInProject();
    log(foundFonts);

})(ANTETYPE_JS_CORE_FACTORY.getInstance());
