
function replacer(key,value)
{
    if (key=="privateProperty1") return undefined;
    else if (key=="privateProperty2") return undefined;
    else return value;
}

class Socket {

    constructor(id, deviceIp, deviceId, deviceKey) {
        this._id = id;
        this._deviceIp = deviceIp;
        this._deviceId = deviceId;
        this._deviceKey = deviceKey;
    }

    get id() {
        return this._id;
    }

    get deviceId() {
        return this._deviceId;
    }

    get deviceIp() {
        return this._deviceIp;
    }

    get deviceKey() {
        return this._deviceKey;
    }

    asJson() {
        return JSON.stringify(this);
    }
};

module.exports = Socket;