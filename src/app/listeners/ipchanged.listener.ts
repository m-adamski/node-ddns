import {Kernel} from "../kernel";
import {IListener} from "../interfaces/listener.interface";
import {IEvent} from "../interfaces/event.interface";

export class IPChangedListener implements IListener {

    protected _kernel: Kernel;

    /**
     * Constructor.
     *
     * @param kernel
     */
    constructor(kernel: Kernel) {
        this._kernel = kernel;
    }

    /**
     * Get Collection of subscribed Events and assigned methods.
     *
     * @return {Map<string, string>}
     */
    public getSubscribedEvents(): Map<string, string> {

        // Define Map & Subscribed Events
        let subscribedEventsCollection = new Map<string, string>();
        subscribedEventsCollection.set("IPChangedEvent", "onIPChanged");

        return subscribedEventsCollection;
    }

    public onIPChanged(event: IEvent): void {

    }
}
