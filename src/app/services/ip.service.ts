import * as RequestPromise from "request-promise";
import {Kernel} from "../kernel";
import {IPException} from "../exceptions/ip.exception";
import {IPChangedEvent} from "../events/ipchanged.event";

export class IP {

    protected _kernel: Kernel;
    
    protected _configServicePath: string;
    protected _configIntervalPath: string;

    protected _configService: string;
    protected _configInterval: number;

    protected _currentIP: string;

    /**
     * Constructor.
     *
     * @param kernel
     * @param configServicePath
     * @param configIntervalPath
     */
    constructor(kernel: Kernel, configServicePath: string, configIntervalPath: string) {
        this._kernel = kernel;
        this._configServicePath = configServicePath;
        this._configIntervalPath = configIntervalPath;

        // Get required params from Config
        this.readConfig();

        // Get current IP for the first time
        this.requestIP(this._configService);

        // Start interval
        this.startInterval(this._configService, this._configInterval);
    }

    /**
     * Start Interval.
     *
     * @param configService
     * @param configInterval
     */
    private startInterval(configService: string, configInterval: number): void {

        // Start interval
        setInterval(() => {
            this.requestIP(configService);
        }, configInterval);
    }

    /**
     * Send Request to IP Service and then process response.
     *
     * @param configService
     */
    private requestIP(configService: string): void {

        // Send Request to IP Service
        this.requestPromise(configService).then((response) => {

            if (response.ip !== undefined) {
                this.processIP(response.ip);
            } else {
                throw new IPException("Response from IP Service does not contain 'ip' field.");
            }
        });
    }

    /**
     * Process response IP.
     *
     * @param currentIP
     */
    private processIP(currentIP: string): void {

        // Check if currentIP is different than global IP
        if (this._currentIP != currentIP) {

            // Create & Broadcast Event
            let ipChangedEvent = new IPChangedEvent(currentIP);
            this._kernel.eventManager.broadcastEvent(ipChangedEvent);

            // Assign Response IP as global
            this._currentIP = currentIP;
        }
    }

    /**
     * Send Request to IP Service.
     *
     * @param configService
     * @return {requestPromise.RequestPromise}
     */
    private requestPromise(configService: string): RequestPromise.RequestPromise {
        return RequestPromise({
            uri: configService,
            json: true
        });
    }

    /**
     * Read Config.
     *
     * @throws {IPException}
     */
    private readConfig(): void {

        if (this._kernel.config.has(this._configServicePath) && this._kernel.config.has(this._configIntervalPath)) {

            // Assign variables
            this._configService = this._kernel.config.get(this._configServicePath);
            this._configInterval = this._kernel.config.get(this._configIntervalPath);
        } else {
            throw new IPException("Config file does not contain required parameters.");
        }
    }
}
