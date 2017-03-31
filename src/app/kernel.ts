import {IP} from "./services/ip.service";
import {EventManager} from "./services/event_manager.service";
import {Config} from "./services/config.service";
import {Logger} from "./services/logger.service";
import {IPChangedListener} from "./listeners/ipchanged.listener";

export class Kernel {

    protected _configFile: string;
    protected _eventManager: EventManager;
    protected _config: Config;
    private _logger: Logger;
    protected _ip: IP;

    /**
     * Constructor.
     *
     * @param configFile
     */
    constructor(configFile: string) {
        this._configFile = configFile;
    }

    /**
     * Init all Dependencies.
     */
    public init(): void {

        // Create all required Services
        this._eventManager = new EventManager();
        this._config = new Config(this._configFile);
        this._logger = new Logger(this);
        this._ip = new IP(this);

        // Register Event Listeners
        this.eventManager.registerListener(new IPChangedListener(this));

        // Log Welcome message
        this._logger.log("info", "Cloudflare DDNS Service is running..", "Kernel");

        // Init IP Service
        this._ip.initService();
    }

    /**
     * Get Event Manager.
     *
     * @return {EventManager}
     */
    get eventManager(): EventManager {
        return this._eventManager;
    }

    /**
     * Get Config.
     *
     * @return {Config}
     */
    get config(): Config {
        return this._config;
    }

    /**
     * Get Logger.
     *
     * @return {Logger}
     */
    get logger(): Logger {
        return this._logger;
    }
}
