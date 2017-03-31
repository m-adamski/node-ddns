"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ip_service_1 = require("./services/ip.service");
var event_manager_service_1 = require("./services/event_manager.service");
var config_service_1 = require("./services/config.service");
var logger_service_1 = require("./services/logger.service");
var ipchanged_listener_1 = require("./listeners/ipchanged.listener");
var Kernel = (function () {
    function Kernel(configFile) {
        this._configFile = configFile;
    }
    Kernel.prototype.init = function () {
        this._eventManager = new event_manager_service_1.EventManager();
        this._config = new config_service_1.Config(this._configFile);
        this._logger = new logger_service_1.Logger(this);
        this._ip = new ip_service_1.IP(this);
        this.eventManager.registerListener(new ipchanged_listener_1.IPChangedListener(this));
        this._logger.log("info", "Cloudflare DDNS Service is running..", "Kernel");
        this._ip.initService();
    };
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
    Object.defineProperty(Kernel.prototype, "logger", {
        get: function () {
            return this._logger;
        },
        enumerable: true,
        configurable: true
    });
    return Kernel;
}());
exports.Kernel = Kernel;
//# sourceMappingURL=kernel.js.map