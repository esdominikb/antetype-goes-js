/*
    command aufrufen
*/
//var command = GDAddEmptyCellCommand.command();
//document.commandManager().executeCommand(command);


var core = new CORE();

for(var obj in core.selectionController.selectedObjects()){
    log(obj);
};
