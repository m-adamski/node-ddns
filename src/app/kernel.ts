import {EventManager} from "./services/event_manager.service";
import {Config} from "./services/config.service";

export class Kernel {

    protected _configFile: string;
    protected _eventManager: EventManager;
    protected _config: Config;

    constructor(configFile: string) {
        this._configFile = configFile;

        this._eventManager = new EventManager();
        this._config = new Config(configFile);
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
