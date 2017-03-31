"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileSystem = require("fs");
var YamlParser = require("js-yaml");
var config_exception_1 = require("../exceptions/config.exception");
var Config = (function () {
    function Config(configFile, configBranchesSeparator) {
        this._configFile = configFile;
        this._configBranchesSeparator = configBranchesSeparator || ".";
        this._configFileContent = this.readConfigFile(configFile);
    }
    Config.prototype.get = function (propertyPath) {
        if (propertyPath) {
            return this.readProperty(propertyPath);
        }
        else {
            return this._configFileContent;
        }
    };
    Config.prototype.has = function (propertyPath) {
        return this.readProperty(propertyPath, true);
    };
    Config.prototype.readConfigFile = function (configFile) {
        if (FileSystem.existsSync(configFile)) {
            try {
                return YamlParser.safeLoad(FileSystem.readFileSync(configFile, "utf8"));
            }
            catch (error) {
                throw new config_exception_1.ConfigException("Error while parsing Config File.");
            }
        }
        else {
            throw new config_exception_1.ConfigException("Specified Config File does not exist.");
        }
    };
    Config.prototype.scanConfigTree = function (propertyName, propertyBranch) {
        if (propertyBranch[propertyName]) {
            return propertyBranch[propertyName];
        }
        throw new Error('Property with specified name does not exist');
    };
    Config.prototype.readProperty = function (propertyPath, returnBoolean) {
        var _this = this;
        var returnBool = returnBoolean || false;
        var propertyPathArray = propertyPath.split(this._configBranchesSeparator);
        var currentProperty = this._configFileContent;
        if (propertyPathArray.length > 0) {
            propertyPathArray.forEach(function (propertyBranch) {
                try {
                    currentProperty = _this.scanConfigTree(propertyBranch, currentProperty);
                }
                catch (error) {
                    currentProperty = undefined;
                    return false;
                }
            });
        }
        return (returnBool) ? (currentProperty != undefined) : currentProperty;
    };
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=config.service.js.map