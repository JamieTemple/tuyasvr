'use strict';

var controller = require('../controllers/tuyapiController');

module.exports = function (app) {

    controller.initialize(app);

    app.route('/sockets')
        .get(controller.sockets_list);

    app.route('/sockets/:id/')
        .get(controller.socket);

    app.route('/sockets/:id/')
        .post(controller.socketSet);

    app.route('/sockets/:id/state')
        .get(controller.socketState);

    app.route('/sockets/:id/voltage')
        .get(controller.socketVoltage);

    app.route('/sockets/:id/current')
        .get(controller.socketCurrent);

    app.route('/sockets/:id/power')
        .get(controller.socketPower);
};
