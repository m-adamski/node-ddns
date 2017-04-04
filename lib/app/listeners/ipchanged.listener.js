"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        var _this = this;
        var filterType = this._kernel.config.has("app.cloudflare.record_details.type") ? this._kernel.config.get("app.cloudflare.record_details.type") : null;
        var filterName = this._kernel.config.has("app.cloudflare.record_details.name") ? this._kernel.config.get("app.cloudflare.record_details.name") : null;
        this._kernel.logger.log("info", "Checking if DNS Record already exist..", "IPChanged Listener");
        this._kernel.cloudflare.listDNSRecords(filterType, filterName, null, 1, 1).then(function (response) {
            var responseTotalCount = (response.result_info) ? response.result_info.total_count : null;
            var responseRecordID = (response.result[0] && response.result[0]["id"]) ? response.result[0]["id"] : null;
            if (responseTotalCount != null) {
                if (responseTotalCount > 0 && responseRecordID) {
                    _this._kernel.logger.log("info", "DNS Record exist - updating..", "IPChanged Listener");
                    _this._kernel.cloudflare.updateDNSRecord(responseRecordID, filterType, filterName, event.currentIP).then(function (response) {
                        if (response.success) {
                            _this._kernel.logger.log("info", "DNS Record updated successfully!", "IPChanged Listener");
                        }
                        else {
                            _this._kernel.logger.log("error", "Error while updating DNS Record. Response: " + response.errors, "IPChanged Listener");
                        }
                    }).catch(function (error) {
                        _this._kernel.logger.log("error", "Error while updating DNS Record. Response: " + error, "IPChanged Listener");
                    });
                }
                else {
                    _this._kernel.logger.log("info", "DNS Record does not exist - creating new..", "IPChanged Listener");
                    _this._kernel.cloudflare.createDNSRecord(filterType, filterName, event.currentIP).then(function (response) {
                        if (response.success) {
                            _this._kernel.logger.log("info", "DNS Record created successfully!", "IPChanged Listener");
                        }
                        else {
                            _this._kernel.logger.log("error", "Error while creating DNS Record. Response: " + response.errors, "IPChanged Listener");
                        }
                    }).catch(function (error) {
                        _this._kernel.logger.log("error", "Error while creating DNS Record. Response: " + error, "IPChanged Listener");
                    });
                }
            }
        });
    };
    return IPChangedListener;
}());
exports.IPChangedListener = IPChangedListener;
//# sourceMappingURL=ipchanged.listener.js.map