import {IEvent} from "../interfaces/event.interface";
import {IListener} from "../interfaces/listener.interface";
import {EventManagerException} from "../exceptions/event_manager.exception";

export class EventManager {

    protected _listenersCollection: Set<IListener>;

    constructor() {
        this._listenersCollection = new Set<IListener>();
    }

    /**
     * Register Event Listener.
     *
     * @param eventListener
     * @throws {EventManagerException}
     */
    public registerListener(eventListener: IListener): void {

        if (!this._listenersCollection.has(eventListener)) {
            this._listenersCollection.add(eventListener);
        } else {
            throw new EventManagerException("Specified Events Listener is already registered.");
        }
    }

    public broadcastEvent(event: IEvent): void {

        // TODO
    }
}
