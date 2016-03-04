function CORE(){

};

CORE.prototype.selectionController = selectionController;

CORE.prototype.countSelectedObjects = function(){
    return this.selectionController.selectedObjects().length();
};