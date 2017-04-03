import {IP} from "./services/ip.service";
import {EventManager} from "./services/event_manager.service";
import {Config} from "./services/config.service";
import {Logger} from "./services/logger.service";
import {IPChangedListener} from "./listeners/ipchanged.listener";
import {Cloudflare} from "./services/cloudflare.service";

export class Kernel {

    protected _configFile: string;
    protected _eventManager: EventManager;
    protected _config: Config;
    protected _logger: Logger;
    protected _ip: IP;
    protected _cloudflare: Cloudflare;

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

        // Initialize Services
        this.initServices();

        // Initialize Event Listeners
        this.eventManager.registerListener(new IPChangedListener(this));

        // Initialize IP Service
        this._logger.log("info", "Initializing services..", "Kernel");
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

    /**
     * Init Services.
     */
    private initServices(): void {

        // Create all required Services
        this._eventManager = new EventManager();
        this._config = new Config(this._configFile);
        this._logger = new Logger(this);
        this._ip = new IP(this);
        this._cloudflare = new Cloudflare(this);
    }
}
