import {IEvent} from "../interfaces/event.interface";
import {IListener} from "../interfaces/listener.interface";
import {EventManagerException} from "../exceptions/event_manager.exception";

export class EventManager {

    protected _listenersCollection: Set<IListener>;

    /**
     * Constructor.
     */
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

    /**
     * Broadcast Event.
     *
     * @param event
     */
    public broadcastEvent(event: IEvent): void {

        // Define variable with Event Class
        let eventClass: string = event.constructor["name"];

        // Move every registered Event Listener
        this._listenersCollection.forEach((eventListener) => {

            // Get Subscribed Events from current Event Listener
            let subscribedEvents = eventListener.getSubscribedEvents();

            // Check if current Event Listener subscribe current Event
            if (subscribedEvents.has(eventClass)) {

                let eventProcessMethodName = subscribedEvents.get(eventClass);
                eventListener[eventProcessMethodName](event);
            }
        });
    }
}
