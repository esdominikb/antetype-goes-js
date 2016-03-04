function CORE(){

};

CORE.prototype.selectionController = selectionController;

CORE.prototype.countSelectedObjects = function(){
    return this.selectionController.selectedObjects().length();
};


CORE.prototype.forEach = function(obj, iterator){
    for(var i = 0; i < obj.length(); i++){
        iterator(obj[i]);
    }
};