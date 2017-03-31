import * as FileSystem from "fs";
import * as YamlParser from "js-yaml";
import {ConfigException} from "../exceptions/config.exception";

export class Config {

    protected _configFile: string;
    protected _configFileContent: object;
    protected _configBranchesSeparator: string;

    /**
     * Constructor.
     *
     * @param configFile
     * @param configBranchesSeparator
     */
    constructor(configFile: string, configBranchesSeparator?: string) {
        this._configFile = configFile;
        this._configBranchesSeparator = configBranchesSeparator || ".";
        this._configFileContent = this.readConfigFile(configFile);
    }

    /**
     * Function return property from specified path.
     * When property does not exist it return undefined.
     *
     * @param propertyPath
     * @return {any}
     */
    public get(propertyPath?: string): any {

        if (propertyPath) {
            return this.readProperty(propertyPath);
        } else {
            return this._configFileContent;
        }
    }

    /**
     * Function check if specified item exist.
     *
     * @param propertyPath
     * @return {boolean}
     */
    public has(propertyPath: string): boolean {
        return this.readProperty(propertyPath, true);
    }

    /**
     * Read Config File and parse content into object.
     *
     * @param configFile
     * @return {object}
     */
    private readConfigFile(configFile: string): object {

        // Check if Config File exist
        if (FileSystem.existsSync(configFile)) {

            try {

                // Try to read content of Config File & parse Config Object
                return YamlParser.safeLoad(FileSystem.readFileSync(configFile, "utf8"));
            } catch (error) {
                throw new ConfigException("Error while parsing Config File.");
            }
        } else {
            throw new ConfigException("Specified Config File does not exist.");
        }
    }

    /**
     * Function scan specified branch for property with specified name.
     * Throw exception when property with specified name does not exist in current branch.
     *
     * @param propertyName
     * @param propertyBranch
     * @return {any}
     */
    private scanConfigTree(propertyName: string, propertyBranch: object): any {
        if (propertyBranch[propertyName]) {
            return propertyBranch[propertyName];
        }

        throw new Error('Property with specified name does not exist');
    }

    /**
     * Function read config file and return found item or status bool.
     *
     * @param propertyPath
     * @param returnBoolean
     * @return {any}
     */
    private readProperty(propertyPath: string, returnBoolean?: boolean): any {

        let returnBool = returnBoolean || false;

        // Cut specified $propertyPath by dot
        let propertyPathArray: Array<string> = propertyPath.split(this._configBranchesSeparator);
        let currentProperty: object = this._configFileContent;

        // If propertyPathArray length is bigger than zero then move every branch
        if (propertyPathArray.length > 0) {
            propertyPathArray.forEach((propertyBranch: string) => {
                try {
                    currentProperty = this.scanConfigTree(propertyBranch, currentProperty);
                } catch (error) {
                    currentProperty = undefined;
                    return false;
                }
            });
        }

        return (returnBool) ? (currentProperty != undefined) : currentProperty;
    }
}
