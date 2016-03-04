/**
 * enable default web javascript console.
 * could be used later on to have an overlay console in antetype for javascript
 * @type {{log: Function}}
 */
var console = {
    log: function () {
        if (arguments.length > 1) {
            log(JSON.stringify(arguments));
        } else {
            log(arguments[0]);
        }
    }
};

/**
 *
 * @constructor
 */
function ANTETYPE_UTILS () {
};

/**
 *
 * @param obj
 * @param iterator
 */
ANTETYPE_UTILS.prototype.forEach = function (obj, iterator) {
    for (var i = 0; i < obj.length(); i++) {
        iterator(obj[i]);
    }
};