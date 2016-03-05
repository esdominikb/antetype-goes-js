var _log = log.bind(this);

/**
 *
 * @param message
 */
var log = function(message){
    console.log.apply(this, arguments);
};

/**
 * enable default web javascript console.
 * could be used later on to have an overlay console in antetype for javascript
 * @type {{log: Function}}
 */
var console = {
    log: function () {
        if (arguments.length > 1) {
            _log('#AntetypeJS : ' + JSON.stringify(arguments));
        } else {
            _log('#AntetypeJS : ' + arguments[0]);
        }
    }
};

/**
 *
 * @constructor
 */
function ANTETYPE_UTILS () {
    console.log('generate ANTETYPE_UTILS');
};


/**
 *
 */
var ANTETYPE_UTILS_FACTORY = {
    __instance: false,
    getInstance: function(){
        if (this.__instance == false) {
            this.__instance = new ANTETYPE_UTILS();
        }
        return this.__instance;
    }
};

/**
 *
 * @param collection
 * @param iterator
 */
ANTETYPE_UTILS.prototype.forEach = function (collection, iterator) {
    for (var i = 0; i < collection.length(); i++) {
        iterator(i, collection[i]);
    }
};