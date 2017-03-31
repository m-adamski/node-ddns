import {Kernel} from "../kernel";

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
}
