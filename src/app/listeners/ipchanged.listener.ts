import {Kernel} from "../kernel";
import {IListener} from "../interfaces/listener.interface";
import {IPChangedEvent} from "../events/ipchanged.event";
import {ICloudflareResponse} from "../interfaces/cloudflare_response.interface";

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

    /**
     * Action after IP changed.
     *
     * @param event
     */
    public onIPChanged(event: IPChangedEvent): void {

        // Define variables to filter existing DNS records
        let filterType = this._kernel.config.has("app.cloudflare.record_details.type") ? this._kernel.config.get("app.cloudflare.record_details.type") : null;
        let filterName = this._kernel.config.has("app.cloudflare.record_details.name") ? this._kernel.config.get("app.cloudflare.record_details.name") : null;

        // Check if exist DNS record with specified filters
        this._kernel.logger.log("info", "Checking if DNS Record already exist..", "IPChanged Listener");
        this._kernel.cloudflare.listDNSRecords(filterType, filterName, null, 1, 1).then((response: ICloudflareResponse) => {

            // Define variables from Response
            let responseTotalCount: number = (response.result_info) ? response.result_info.total_count : null;
            let responseRecordID: string = (response.result[0] && response.result[0]["id"]) ? response.result[0]["id"] : null;

            if (responseTotalCount != null) {

                if (responseTotalCount > 0 && responseRecordID) {

                    // DNS Record exist - we should send PUT Request
                    this._kernel.logger.log("info", "DNS Record exist - updating..", "IPChanged Listener");
                    this._kernel.cloudflare.updateDNSRecord(responseRecordID, filterType, filterName, event.currentIP).then((response: ICloudflareResponse) => {

                        // Check Response
                        if (response.success) {
                            this._kernel.logger.log("info", "DNS Record updated successfully!", "IPChanged Listener");
                        } else {
                            this._kernel.logger.log("error", `Error while updating DNS Record. Response: ${response.errors}`, "IPChanged Listener");
                        }
                    }).catch((error) => {
                        this._kernel.logger.log("error", `Error while updating DNS Record. Response: ${error}`, "IPChanged Listener");
                    });

                } else {

                    // DNS Record does not exist - we should send POST Request
                    this._kernel.logger.log("info", "DNS Record does not exist - creating new..", "IPChanged Listener");
                    this._kernel.cloudflare.createDNSRecord(filterType, filterName, event.currentIP).then((response: ICloudflareResponse) => {

                        // Check Response
                        if (response.success) {
                            this._kernel.logger.log("info", "DNS Record created successfully!", "IPChanged Listener");
                        } else {
                            this._kernel.logger.log("error", `Error while creating DNS Record. Response: ${response.errors}`, "IPChanged Listener");
                        }
                    }).catch((error) => {
                        this._kernel.logger.log("error", `Error while creating DNS Record. Response: ${error}`, "IPChanged Listener");
                    });
                }
            }
        });
    }
}
