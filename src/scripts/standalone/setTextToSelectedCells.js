/*
    command aufrufen
*/
//var command = GDAddEmptyCellCommand.command();
//document.commandManager().executeCommand(command);


var antetype = new CORE();


var selectedObjs = antetype.selectionController.selectedObjects();


antetype.forEach(selectedObjs, function(obj){
    console.log(obj.name());
});
