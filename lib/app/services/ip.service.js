"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RequestPromise = require("request-promise");
var ip_exception_1 = require("../exceptions/ip.exception");
var ipchanged_event_1 = require("../events/ipchanged.event");
var IP = (function () {
    function IP(kernel, configServicePath, configIntervalPath) {
        this._kernel = kernel;
        this._configServicePath = configServicePath;
        this._configIntervalPath = configIntervalPath;
        this.readConfig();
        this.requestIP(this._configService);
        this.startInterval(this._configService, this._configInterval);
    }
    IP.prototype.startInterval = function (configService, configInterval) {
        var _this = this;
        setInterval(function () {
            _this.requestIP(configService);
        }, configInterval);
    };
    IP.prototype.requestIP = function (configService) {
        var _this = this;
        this.requestPromise(configService).then(function (response) {
            if (response.ip !== undefined) {
                _this.processIP(response.ip);
            }
            else {
                throw new ip_exception_1.IPException("Response from IP Service does not contain 'ip' field.");
            }
        });
    };
    IP.prototype.processIP = function (currentIP) {
        if (this._currentIP != currentIP) {
            var ipChangedEvent = new ipchanged_event_1.IPChangedEvent(currentIP);
            this._kernel.eventManager.broadcastEvent(ipChangedEvent);
            this._currentIP = currentIP;
        }
    };
    IP.prototype.requestPromise = function (configService) {
        return RequestPromise({
            uri: configService,
            json: true
        });
    };
    IP.prototype.readConfig = function () {
        if (this._kernel.config.has(this._configServicePath) && this._kernel.config.has(this._configIntervalPath)) {
            this._configService = this._kernel.config.get(this._configServicePath);
            this._configInterval = this._kernel.config.get(this._configIntervalPath);
        }
        else {
            throw new ip_exception_1.IPException("Config file does not contain required parameters.");
        }
    };
    return IP;
}());
exports.IP = IP;
//# sourceMappingURL=ip.service.js.map