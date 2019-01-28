
var moment = require('moment');

var _name;
var _debug;

module.exports = {
    initialize: function(name, debug, startupMessage) {
        _name = name;
        _debug = debug;

        if (startupMessage != undefined) {
            this.log(startupMessage);
        }
    },

    log: function(message) {
        if (_debug) {
            console.log('\x1b[35m%s\x1b[0m', '[' + _name + '] ' + moment().format('YYYY-MM-DD HH:mm:ss.SSS') + ' - ' + message);
        }
    },

    
    info: function(message) {
        if (_debug) {
            console.info('\x1b[35m%s\x1b[0m', '[' + _name + '] ' + moment().format('YYYY-MM-DD HH:mm:ss.SSS') + ' - ' + message);
        }
    }
};
