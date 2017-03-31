import * as ForeverMonitor from "forever-monitor";

// Initialize Forever Monitor
let app = new ForeverMonitor.Monitor("lib/index.js");

// Define Forever Monitor events
app.on('restart', function () {
    console.error('Forever restarting script for ' + app["times"] + ' time');
});

app.on('exit:code', function (code) {
    console.error('Forever detected script exited with code ' + code);
});

// Start Forever Monitor
app.start();
