import * as Request from "request-promise";
import {Kernel} from "../kernel";
import {CloudflareException} from "../exceptions/cloudflare.exception";

export class Cloudflare {

    protected _kernel: Kernel;
    protected _apiVersion: number = 4.0;
    protected _apiRequestService: string = "https://api.cloudflare.com/client/v4";

    /**
     * Constructor.
     *
     * @param kernel
     */
    constructor(kernel: Kernel) {
        this._kernel = kernel;
    }

    public listDNSRecords(type?: string, name?: string, content?: string, page?: number, perPage?: number): void {

        // Define default variables
        let filterType: string = type || null;
        let filterName: string = name || null;
        let filterContent: string = content || null;
        let filterPage: number = page || 1;
        let filterPerPage: number = perPage || 20;

        try {

            // Define Request Parameters
            let requestParams = {};

            if (filterType) {
                requestParams["type"] = filterType;
            }

            if (filterName) {
                requestParams["name"] = filterName;
            }

            if (filterContent) {
                requestParams["content"] = filterContent;
            }

            // Try to generate Request Uri & Request Promise
            let requestUri = this.buildRequestUri(["dns_records"]);
            let requestPromise = this.buildRequest(requestUri, this.mergeObjects(requestParams, {
                "page": filterPage,
                "per_page": filterPerPage
            }));

            // Get Request Response
            requestPromise.then((response) => {

                console.log(response);

            }).catch((error => {
                throw new CloudflareException(`Cloudflare Api Exception: ${error}`);
            }));

        } catch (error) {
            throw error;
        }
    }

    /**
     * Generate Request Uri with specified parameters.
     *
     * @param params
     * @return {any}
     */
    private buildRequestUri(params?: Array<string>): string {

        // Get required parameters from Config
        let configZoneID: string = this._kernel.config.has("services.cloudflare.zone_id") ? this._kernel.config.get("services.cloudflare.zone_id") : null;

        if (configZoneID) {

            // Define first part of Request Uri
            let requestUri: string = this._apiRequestService + `/zones/${configZoneID}`;

            // Check if set additional parameters
            if (params && params.length > 0) {

                // Move every parameter & add to Request Uri
                params.forEach((param) => {
                    requestUri += "/" + param;
                });
            }

            return requestUri;
        }

        throw new CloudflareException("Configuration file does not contain required params to generate Cloudflare Request Uri.");
    }

    /**
     * Generate Request Promise.
     *
     * @param uri
     * @param params
     * @return {requestPromise.RequestPromise}
     */
    private buildRequest(uri: string, params?: object): Request.RequestPromise {

        // Get required parameters from Config
        let requestAuthEmail: string = this._kernel.config.has("services.cloudflare.account") ? this._kernel.config.get("services.cloudflare.account") : null;
        let requestAuthApiKey: string = this._kernel.config.has("services.cloudflare.api_key") ? this._kernel.config.get("services.cloudflare.api_key") : null;

        if (requestAuthEmail && requestAuthApiKey) {

            // Return Request Promise
            return Request({
                uri: uri,
                qs: params ? params : {},
                headers: {
                    "X-Auth-Email": requestAuthEmail,
                    "X-Auth-Key": requestAuthApiKey
                },
                json: true
            });
        }

        throw new CloudflareException("Configuration file does not contain required params to generate Cloudflare Request.");
    }

    /**
     * Merge Objects into one response object.
     *
     * @param args
     * @return {Object}
     */
    private mergeObjects(...args: Array<any>): object {

        // Define response Object
        let responseObject: object = {};

        // Move every args & merge variables into Response Object
        args.forEach((obj) => {

            for (let propertyName in obj) {
                if (!responseObject.hasOwnProperty(propertyName)) {
                    responseObject[propertyName] = obj[propertyName];
                }
            }
        });

        return responseObject;
    }
}
