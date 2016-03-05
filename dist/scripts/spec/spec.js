/**/


(function(antetype){

    var colors = antetype.commands.getAllColorsInProject();
    var fonts = antetype.commands.getAllFontsInProject();

    log(colors, fonts);

})(ANTETYPE_JS_CORE_FACTORY.getInstance());