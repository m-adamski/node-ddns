"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kernel_1 = require("./app/kernel");
var kernel = new kernel_1.Kernel("config.yml");
console.log(kernel.config.get("version"));
//# sourceMappingURL=index.js.map