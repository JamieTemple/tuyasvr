'use strict';

var TuyaDevice = require('tuyapi'),
    Socket = require('../models/socketModel'),
    logger = require('../../logger'),
    fs = require('fs');

var socketsList = [];
var devicesList = [];


// dps id details for sockets:
// 1 = state (true/false)
// 2 = ?
// 3 = ?
// 4 = Current (mA) (23)
// 5 = Power (W) (* 10)
// 6 = Voltage (V) (* 10)

// ? = In total (KWh) (0.52)
// ? = Total electricity quantity (KWh) (0.03) 


// -------------------------------------------------------------------------------------------------
// ...
function bmap(istate) {
    return istate ? 'ON' : "OFF";
}

// -------------------------------------------------------------------------------------------------
// ...
function getDevice(socketId) {
    var device = socketsList.find(function (e) { return e.id == socketId });

    logger.log("getting device" + JSON.stringify(device));

    var tuyaDevice = new TuyaDevice({
        ip: device.deviceIp,
        id: device.deviceId,
        key: device.deviceKey
    });

    return tuyaDevice;
}

// -------------------------------------------------------------------------------------------------
// ...
function initialiseDevice(id, deviceIp, deviceId, deviceKey) {
    var newSocket = new Socket(id, deviceIp, deviceId, deviceKey);

    logger.log("Initialising a new device - " + newSocket.asJson());

    socketsList.push(newSocket);

    var device = new TuyaDevice({
        ip: deviceIp,
        id: deviceId,
        key: deviceKey,
        persistentConnection: true
    });

    device.on('connected', () => {
        logger.info('Connected to device.');
    });

    device.on('disconnected', () => {
        logger.info('Disconnected from device.');
    });

    //device.connect();
    //device.disconnect();

    devicesList.push(device);
}

// -------------------------------------------------------------------------------------------------
let controller = {

    initialize: function (app) {
        logger.log("Controller starting up...");

        var deviceList = JSON.parse(fs.readFileSync("config.json"));

        deviceList.devices.forEach(element => {
            initialiseDevice(element.id, element.deviceIp, element.deviceId, element.deviceKey);
        });
    },

    // -------------------------------------------------------------------------------------------------
    sockets_list: function (req, res) {
        logger.log("List sockets...");

        var jsonList = [];

        socketsList.forEach(element => {
            jsonList.push(element.asJson());
        });

        res.json(jsonList);
    },

    // -------------------------------------------------------------------------------------------------
    socket: function (req, res) {
        var device = socketsList.find(function (e) { return e.id == req.params['id'] });

        if (device == undefined) {
            res.json("Device not found.");
        } else {
            res.json(device.asJson());
        }
    },

    // -------------------------------------------------------------------------------------------------
    socketState: function (req, res) {
        var device = getDevice(req.params['id']);

        logger.log("Getting state of " + req.params['id']);

        device.get().then(state => {
            logger.log(bmap(state));
            res.json(bmap(state));
        }, reason => {
            logger.log(reason.toString());
            res.json(reason.toString());
        });
    },

    // -------------------------------------------------------------------------------------------------
    socketVoltage: function (req, res) {
        var device = getDevice(req.params['id']);

        device.get({dps:6}).then(result => {
            var voltage = result / 10;
            logger.log(voltage);
            res.json(voltage);
        }, reason => {
            logger.log(reason.toString());
            res.json(reason.toString());
        });
    },

    // -------------------------------------------------------------------------------------------------
    socketCurrent: function (req, res) {
        var device = getDevice(req.params['id']);

        device.get({dps:4}).then(result => {
            var current = result;
            logger.log(current);
            res.json(current);
        }, reason => {
            logger.log(reason.toString());
            res.json(reason.toString());
        });
    },

    // -------------------------------------------------------------------------------------------------
    socketPower: function (req, res) {
        var device = getDevice(req.params['id']);

        device.get({dps:5}).then(result => {
            var power = result / 10;
            logger.log(power);
            res.json(power);
        }, reason => {
            logger.log(reason.toString());
            res.json(reason.toString());
        });
    },

    // -------------------------------------------------------------------------------------------------
    socketSet: function (req, res) {
        var device = getDevice(req.params['id']);

        var isSwitchOn = req.body == "ON";
        var isSwitchOff = req.body == "OFF";
    
        if (isSwitchOn) {
            device.set({ set: true }).then(result => {
                if (result) {
                    logger.log("Success!");
                    res.json("ON");
                } else {
                    logger.log("Something went wrong :(");
                    res.json("ERROR");
                }
            }, reason => {
                logger.log(reason.toString());
                res.json(reason.toString());
            });
        } else if (isSwitchOff) {
            device.set({ set: false }).then(result => {
                if (result) {
                    logger.log("Success!");
                    res.json("OFF");
                } else {
                    logger.log("Something went wrong :(");
                    res.json("ERROR");
                }
            }, reason => {
                logger.log(reason.toString());
                res.json(reason.toString());
            });
        }
    }
};

module.exports = controller;