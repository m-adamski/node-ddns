import {Kernel} from "./app/kernel";

// Define Application Kernel
let kernel = new Kernel("config.yml");

console.log(kernel.config.get("version"));
