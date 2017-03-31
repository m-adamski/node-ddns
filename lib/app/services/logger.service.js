"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Winston = require("winston");
var WinstonDailyRotateFile = require("winston-daily-rotate-file");
var Logger = (function () {
    function Logger(kernel) {
        this._allowedTransports = ["console", "file"];
        this._kernel = kernel;
        this._winstonLogger = this.getWinstonLogger();
    }
    Logger.prototype.log = function (logLevel, logMessage, logOwner, logCallback) {
        if (logOwner) {
            this._winstonLogger.log(logLevel, logOwner + " - " + logMessage, logCallback);
        }
        else {
            this._winstonLogger.log(logLevel, "" + logMessage, logCallback);
        }
    };
    Logger.prototype.getWinstonLogger = function () {
        var _this = this;
        this._winstonTransporters = {
            console: Winston.transports.Console,
            file: WinstonDailyRotateFile
        };
        var transportsArray = [];
        var configTransports = Array.isArray(this._kernel.config.get("app.logger")) ? this._kernel.config.get('app.logger') : [];
        configTransports.forEach(function (currentTransportName) {
            if (_this._kernel.config.has("services.logger." + currentTransportName) && (currentTransportName in _this._winstonTransporters)) {
                var currentTransporterOptions = _this._kernel.config.get("services.logger." + currentTransportName);
                var currentTransporter = new _this._winstonTransporters[currentTransportName](currentTransporterOptions);
                transportsArray.push(currentTransporter);
            }
        });
        this._winstonLogger = new (Winston.Logger)({
            transports: transportsArray
        });
        return this._winstonLogger;
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.service.js.map