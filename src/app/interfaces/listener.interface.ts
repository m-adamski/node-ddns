export interface IListener {
    getSubscribedEvents(): Map<string, string>;
}
