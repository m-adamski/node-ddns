export class IPChangedEvent {

    private _currentIP: string;

    /**
     * Constructor.
     *
     * @param currentIP
     */
    constructor(currentIP: string) {
        this._currentIP = currentIP;
    }

    /**
     * Get Current IP.
     *
     * @return {string}
     */
    get currentIP(): string {
        return this._currentIP;
    }
}
