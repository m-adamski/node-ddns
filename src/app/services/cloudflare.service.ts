import * as Request from "request-promise";
import {Kernel} from "../kernel";
import {CloudflareException} from "../exceptions/cloudflare.exception";
import {ICloudflareResponse} from "../interfaces/cloudflare_response.interface";

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

    /**
     * List all DNS Records with specified params.
     *
     * @param type
     * @param name
     * @param content
     * @param page
     * @param perPage
     * @return {Request.RequestPromise}
     */
    public listDNSRecords(type?: string, name?: string, content?: string, page?: number, perPage?: number): Request.RequestPromise {

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
            return this.buildRequest("GET", requestUri, this.mergeObjects(requestParams, {
                "page": filterPage,
                "per_page": filterPerPage
            }));

        } catch (error) {
            throw error;
        }
    }

    /**
     * Create new DNS Record.
     *
     * @param type
     * @param name
     * @param content
     * @param ttl
     * @param proxied
     * @return {Request.RequestPromise}
     */
    public createDNSRecord(type: string, name: string, content: string, ttl?: number, proxied?: boolean): Request.RequestPromise {

        // Check if specified variables are not null
        if (type && name && content) {

            // Define default variables
            let requestTTL: number = ttl || 1;
            let requestProxied: boolean = proxied || false;

            try {

                // Try to generate Request Uri & Request Promise
                let requestUri = this.buildRequestUri(["dns_records"]);
                return this.buildRequest("POST", requestUri, {}, {
                    "type": type,
                    "name": name,
                    "content": content,
                    "ttl": requestTTL,
                    "proxied": requestProxied
                });

            } catch (error) {
                throw error;
            }
        }

        throw new CloudflareException("Configuration file does not contain required params to generate Cloudflare Request.");
    }

    /**
     * Update existing DNS with specified ID.
     *
     * @param id
     * @param type
     * @param name
     * @param content
     * @param ttl
     * @param proxied
     * @return {Request.RequestPromise}
     */
    public updateDNSRecord(id: string, type: string, name: string, content: string, ttl?: number, proxied?: boolean): Request.RequestPromise {

        // Check if specified variables are not null
        if (id && content) {

            // Define default variables
            let requestTTL: number = ttl || 1;
            let requestProxied: boolean = proxied || false;

            try {

                // Try to generate Request Uri & Request Promise
                let requestUri = this.buildRequestUri(["dns_records", id]);
                return this.buildRequest("PUT", requestUri, {}, {
                    "content": content,
                    "ttl": requestTTL,
                    "proxied": requestProxied
                });

            } catch (error) {
                throw error;
            }
        }

        throw new CloudflareException("Configuration file does not contain required params to generate Cloudflare Request.");
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
     * @param method
     * @param uri
     * @param params
     * @param data
     * @return {Request.RequestPromise}
     */
    private buildRequest(method: string, uri: string, params?: object, data?: object): Request.RequestPromise {

        // Get required parameters from Config
        let requestAuthEmail: string = this._kernel.config.has("services.cloudflare.account") ? this._kernel.config.get("services.cloudflare.account") : null;
        let requestAuthApiKey: string = this._kernel.config.has("services.cloudflare.api_key") ? this._kernel.config.get("services.cloudflare.api_key") : null;

        if (requestAuthEmail && requestAuthApiKey) {

            // Return Request Promise
            return Request({
                method: method,
                uri: uri,
                qs: params ? params : {},
                body: data ? data : {},
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
