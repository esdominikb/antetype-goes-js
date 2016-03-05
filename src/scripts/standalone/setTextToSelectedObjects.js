/*
 command aufrufen
 */


(
/**
 *
 * @param antetype
 * @param utils
 */
function (antetype, utils) {


    // set text only for first child in selected objects
    //antetype.commands.setTextToSelectedObjects('hah22a');

    // set text for all cells of selected objects
    antetype.commands.setTextToSelectedObjects('hah22a', true);

})(new ANTETYPE_JS_CORE(), new ANTETYPE_UTILS());
