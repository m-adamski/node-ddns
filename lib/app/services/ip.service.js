"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RequestPromise = require("request-promise");
var ip_exception_1 = require("../exceptions/ip.exception");
var ipchanged_event_1 = require("../events/ipchanged.event");
var IP = (function () {
    function IP(kernel) {
        this._kernel = kernel;
    }
    IP.prototype.initService = function () {
        this.readConfig();
        this.requestIP(this._configService);
        this.startInterval(this._configService, this._configInterval);
    };
    IP.prototype.startInterval = function (configService, configInterval) {
        var _this = this;
        setInterval(function () {
            _this.requestIP(configService);
        }, configInterval);
    };
    IP.prototype.requestIP = function (configService) {
        var _this = this;
        this._kernel.logger.log("info", "Sending request to receive current IP address..", "IP");
        this.requestPromise(configService).then(function (response) {
            if (response.ip !== undefined) {
                _this._kernel.logger.log("info", "Received IP address: " + response.ip, "IP");
                _this.processIP(response.ip);
            }
            else {
                throw new ip_exception_1.IPException("Response from IP Service does not contain 'ip' field.");
            }
        });
    };
    IP.prototype.processIP = function (currentIP) {
        if (this._currentIP != currentIP) {
            this._kernel.logger.log("info", "IP address changed [" + this._currentIP + " => " + currentIP + "] - broadcasting event..", "IP");
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
        if (this._kernel.config.has("services.ip.service") && this._kernel.config.has("services.ip.interval")) {
            this._configService = this._kernel.config.get("services.ip.service");
            this._configInterval = this._kernel.config.get("services.ip.interval");
        }
        else {
            throw new ip_exception_1.IPException("Config file does not contain required parameters.");
        }
    };
    return IP;
}());
exports.IP = IP;
//# sourceMappingURL=ip.service.js.map