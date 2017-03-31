"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPChangedListener = (function () {
    function IPChangedListener(kernel) {
        this._kernel = kernel;
    }
    IPChangedListener.prototype.getSubscribedEvents = function () {
        var subscribedEventsCollection = new Map();
        subscribedEventsCollection.set("IPChangedEvent", "onIPChanged");
        return subscribedEventsCollection;
    };
    IPChangedListener.prototype.onIPChanged = function (event) {
    };
    return IPChangedListener;
}());
exports.IPChangedListener = IPChangedListener;
//# sourceMappingURL=ipchanged.listener.js.map