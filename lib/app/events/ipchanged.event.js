"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPChangedEvent = (function () {
    function IPChangedEvent(currentIP) {
        this._currentIP = currentIP;
    }
    Object.defineProperty(IPChangedEvent.prototype, "currentIP", {
        get: function () {
            return this._currentIP;
        },
        enumerable: true,
        configurable: true
    });
    return IPChangedEvent;
}());
exports.IPChangedEvent = IPChangedEvent;
//# sourceMappingURL=ipchanged.event.js.map