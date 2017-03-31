"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_manager_exception_1 = require("../exceptions/event_manager.exception");
var EventManager = (function () {
    function EventManager() {
        this._listenersCollection = new Set();
    }
    EventManager.prototype.registerListener = function (eventListener) {
        if (!this._listenersCollection.has(eventListener)) {
            this._listenersCollection.add(eventListener);
        }
        else {
            throw new event_manager_exception_1.EventManagerException("Specified Events Listener is already registered.");
        }
    };
    EventManager.prototype.broadcastEvent = function (event) {
    };
    return EventManager;
}());
exports.EventManager = EventManager;
//# sourceMappingURL=event_manager.service.js.map