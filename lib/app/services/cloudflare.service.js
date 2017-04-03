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
            return this.buildRequest("GET", requestUri, this.mergeObjects(requestParams, {
                "page": filterPage,
                "per_page": filterPerPage
            }));
        }
        catch (error) {
            throw error;
        }
    };
    Cloudflare.prototype.createDNSRecord = function (type, name, content, ttl, proxied) {
        if (type && name && content) {
            var requestTTL = ttl || 1;
            var requestProxied = proxied || false;
            try {
                var requestUri = this.buildRequestUri(["dns_records"]);
                return this.buildRequest("POST", requestUri, {}, {
                    "type": type,
                    "name": name,
                    "content": content,
                    "ttl": requestTTL,
                    "proxied": requestProxied
                });
            }
            catch (error) {
                throw error;
            }
        }
        throw new cloudflare_exception_1.CloudflareException("Configuration file does not contain required params to generate Cloudflare Request.");
    };
    Cloudflare.prototype.updateDNSRecord = function (id, type, name, content, ttl, proxied) {
        if (id && content) {
            var requestTTL = ttl || 1;
            var requestProxied = proxied || false;
            try {
                var requestUri = this.buildRequestUri(["dns_records", id]);
                return this.buildRequest("PUT", requestUri, {}, {
                    "content": content,
                    "ttl": requestTTL,
                    "proxied": requestProxied
                });
            }
            catch (error) {
                throw error;
            }
        }
        throw new cloudflare_exception_1.CloudflareException("Configuration file does not contain required params to generate Cloudflare Request.");
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
    Cloudflare.prototype.buildRequest = function (method, uri, params, data) {
        var requestAuthEmail = this._kernel.config.has("services.cloudflare.account") ? this._kernel.config.get("services.cloudflare.account") : null;
        var requestAuthApiKey = this._kernel.config.has("services.cloudflare.api_key") ? this._kernel.config.get("services.cloudflare.api_key") : null;
        if (requestAuthEmail && requestAuthApiKey) {
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