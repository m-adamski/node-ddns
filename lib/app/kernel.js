"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_manager_service_1 = require("./services/event_manager.service");
var config_service_1 = require("./services/config.service");
var Kernel = (function () {
    function Kernel(configFile) {
        this._configFile = configFile;
        this._eventManager = new event_manager_service_1.EventManager();
        this._config = new config_service_1.Config(configFile);
    }
    Object.defineProperty(Kernel.prototype, "eventManager", {
        get: function () {
            return this._eventManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Kernel.prototype, "config", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    return Kernel;
}());
exports.Kernel = Kernel;
//# sourceMappingURL=kernel.js.map