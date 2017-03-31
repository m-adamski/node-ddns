import {EventManager} from "./services/event_manager.service";
import {Config} from "./services/config.service";
import {IP} from "./services/ip.service";

export class Kernel {

    protected _configFile: string;
    protected _eventManager: EventManager;
    protected _config: Config;
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
        this._ip = new IP(this, "ip.service", "ip.interval");
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
}
