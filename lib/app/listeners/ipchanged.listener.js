"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cloudflare_service_1 = require("../services/cloudflare.service");
var IPChangedListener = (function () {
    function IPChangedListener(kernel) {
        this._kernel = kernel;
    }
    IPChangedListener.prototype.getSubscribedEvents = function () {
        var subscribedEventsCollection = new Map();
        subscribedEventsCollection.set("IPChangedEvent", "onIPChanged");
        return subscribedEventsCollection;
    };
    IPChangedListener.prototype.onIPChanged = function (event) {
        var cloudflareService = new cloudflare_service_1.Cloudflare(this._kernel);
        cloudflareService.listDNSRecords();
    };
    return IPChangedListener;
}());
exports.IPChangedListener = IPChangedListener;
//# sourceMappingURL=ipchanged.listener.js.map