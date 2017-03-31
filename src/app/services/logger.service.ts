import * as Winston from "winston";
import * as WinstonDailyRotateFile from "winston-daily-rotate-file";
import {Kernel} from "../kernel";

export class Logger {

    protected _kernel: Kernel;
    protected _winstonLogger: Winston.LoggerInstance;
    protected _winstonTransporters: Object;
    protected _allowedTransports: Array<string> = ["console", "file"];

    /**
     * Constructor.
     *
     * @param kernel
     */
    constructor(kernel: Kernel) {
        this._kernel = kernel;
        this._winstonLogger = this.getWinstonLogger();
    }

    /**
     * Log message with specified level.
     *
     * @param logLevel
     * @param logMessage
     * @param logOwner
     * @param logCallback
     */
    public log(logLevel: string, logMessage: string, logOwner?: string, logCallback?: Winston.LogCallback): void {

        if (logOwner) {
            this._winstonLogger.log(logLevel, `${logOwner} - ${logMessage}`, logCallback);
        } else {
            this._winstonLogger.log(logLevel, `${logMessage}`, logCallback);
        }
    }

    /**
     * Generate Winston Logger Instance.
     *
     * @return {Winston.LoggerInstance}
     */
    private getWinstonLogger(): Winston.LoggerInstance {

        // Define allowed Winston Transporters
        this._winstonTransporters = {
            console: Winston.transports.Console,
            file: WinstonDailyRotateFile
        };

        // Define transports array
        let transportsArray = [];

        // Get defined transports from config - app.logger
        let configTransports = Array.isArray(this._kernel.config.get("app.logger")) ? this._kernel.config.get('app.logger') : [];

        // Move every transport
        configTransports.forEach(currentTransportName => {

            // Check if currentTransportName is configured in config logger section
            if (this._kernel.config.has(`services.logger.${currentTransportName}`) && (currentTransportName in this._winstonTransporters)) {

                // Define current transporter variables
                let currentTransporterOptions = this._kernel.config.get(`services.logger.${currentTransportName}`);
                let currentTransporter = new this._winstonTransporters[currentTransportName](currentTransporterOptions);

                // Push into transporters array
                transportsArray.push(currentTransporter);
            }
        });

        // Create new Winston Logger
        this._winstonLogger = new (Winston.Logger)({
            transports: transportsArray
        });

        return this._winstonLogger;
    }
}
