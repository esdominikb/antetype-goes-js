/*
 command aufrufen
 */


(
/**
 *
 * @param antetype
 */
function (antetype) {


    // set text only for first child in selected objects
    //antetype.commands.setTextToSelectedObjects('hah22a');

    // set text for all cells of selected objects
    antetype.commands.setTextToSelectedObjects('hah22a', true);

})(ANTETYPE_JS_CORE_FACTORY.getInstance());
