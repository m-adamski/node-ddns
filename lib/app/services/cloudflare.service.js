"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Request = require("request-promise");
var cloudflare_exception_1 = require("../exceptions/cloudflare.exception");
var Cloudflare = (function () {
    function Cloudflare(kernel) {
        this._apiVersion = 4.0;
        this._apiRequestService = "https://api.cloudflare.com/client/v4";
        this._kernel = kernel;
    }
    Cloudflare.prototype.listDNSRecords = function (type, name, content, page, perPage) {
        var filterType = type || null;
        var filterName = name || null;
        var filterContent = content || null;
        var filterPage = page || 1;
        var filterPerPage = perPage || 20;
        try {
            var requestParams = {};
            if (filterType) {
                requestParams["type"] = filterType;
            }
            if (filterName) {
                requestParams["name"] = filterName;
            }
            if (filterContent) {
                requestParams["content"] = filterContent;
            }
            var requestUri = this.buildRequestUri(["dns_records"]);
            var requestPromise = this.buildRequest(requestUri, this.mergeObjects(requestParams, {
                "page": filterPage,
                "per_page": filterPerPage
            }));
            requestPromise.then(function (response) {
                console.log(response);
            }).catch((function (error) {
                console.log(error);
            }));
        }
        catch (error) {
            console.log("CATCH");
        }
    };
    Cloudflare.prototype.buildRequestUri = function (params) {
        var configZoneID = this._kernel.config.has("services.cloudflare.zone_id") ? this._kernel.config.get("services.cloudflare.zone_id") : null;
        if (configZoneID) {
            var requestUri_1 = this._apiRequestService + ("/zones/" + configZoneID);
            if (params && params.length > 0) {
                params.forEach(function (param) {
                    requestUri_1 += "/" + param;
                });
            }
            return requestUri_1;
        }
        throw new cloudflare_exception_1.CloudflareException("Configuration file does not contain required params to generate Cloudflare Request Uri.");
    };
    Cloudflare.prototype.buildRequest = function (uri, params) {
        var requestAuthEmail = this._kernel.config.has("services.cloudflare.account") ? this._kernel.config.get("services.cloudflare.account") : null;
        var requestAuthApiKey = this._kernel.config.has("services.cloudflare.api_key") ? this._kernel.config.get("services.cloudflare.api_key") : null;
        if (requestAuthEmail && requestAuthApiKey) {
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
        throw new cloudflare_exception_1.CloudflareException("Configuration file does not contain required params to generate Cloudflare Request.");
    };
    Cloudflare.prototype.mergeObjects = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var responseObject = {};
        args.forEach(function (obj) {
            for (var propertyName in obj) {
                if (!responseObject.hasOwnProperty(propertyName)) {
                    responseObject[propertyName] = obj[propertyName];
                }
            }
        });
        return responseObject;
    };
    return Cloudflare;
}());
exports.Cloudflare = Cloudflare;
//# sourceMappingURL=cloudflare.service.js.map