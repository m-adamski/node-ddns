export class IPChangedEvent {

    protected _currentIP: string;

    /**
     * Constructor.
     *
     * @param currentIP
     */
    constructor(currentIP: string) {
        this._currentIP = currentIP;
    }
}
