"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ForeverMonitor = require("forever-monitor");
var app = new ForeverMonitor.Monitor("lib/index.js");
app.on('restart', function () {
    console.error('Forever restarting script for ' + app["times"] + ' time');
});
app.on('exit:code', function (code) {
    console.error('Forever detected script exited with code ' + code);
});
app.start();
//# sourceMappingURL=forever.js.map