const
    recursive = require("recursive-readdir-sync"),
    s = require("underscore.string");

/**
 * @class
 */
class EmberModule {

    /**
     * @param {String} filePath
     */
    constructor (filePath) {

        const
            filename = filePath.split("/").slice(-1)[0].replace(".js", ""),
            rootDir = filePath.split("/")[0],
            folder = filePath.split("/").slice(-2)[0],
            parentFolder = filePath.split("/").slice(-3)[0];

        this.moduleName = filename;

        if (rootDir !== "base") {

            this.isModel = rootDir === "models";
            this.isMixin = rootDir === "mixins";
            this.isController = filename === "controller";
            this.isAdapter = rootDir === "adapters";
            this.isSerializer = rootDir === "serializers";
            this.isHelper = rootDir === "helpers";
            this.isService = rootDir === "services";
            this.isRoute = filename === "route";

            if (["blocks", "common"].includes(parentFolder) && filename === "index") {
                this.moduleName = folder;
                this.isComponent = true;
            }
        }

        this.filePath = filePath;

    }


    /**
     * @return {String}
     */
    getClassName () {

        if (this.isModel) {
            return s.classify(this.moduleName);
        } else if (this.isMixin) {
            return s.classify(this.moduleName + "-mixin");
        } else if (this.isAdapter) {
            return s.classify(this.moduleName + "-adapter");
        } else if (this.isSerializer) {
            return s.classify(this.moduleName + "-serializer");
        } else if (this.isHelper) {
            return s.classify(this.moduleName + "-helper");
        } else if (this.isService) {
            return s.classify(this.moduleName + "-service");
        } else if (this.isComponent) {
            return s.classify(this.moduleName + "-component");
        } else if (this.isController) {

            const name = this.filePath
                .replace(/^components\/routes\//, "")
                .replace(/\/routes/g, "")
                .split("/")
                .slice(0, -1)
                .join("-");

            return s.classify(name + "-controller");

        } else if (this.isRoute) {

            const name = this.filePath
                .replace(/^components\/routes\//, "")
                .replace(/\/routes/g, "")
                .split("/")
                .slice(0, -1)
                .join("-");

            return s.classify(name + "-route");

        } else {

            return null;

        }

    }

}

module.exports = function (content) {

    const
        appDir = "app",
        modulePaths = recursive(appDir).filter(filePath => {
            return /\.js$/.test(filePath) && filePath.split("/").length > 2;
        }).map(filePath => {
            return filePath.replace(appDir, ".");
        }),
        imports = modulePaths.map(filePath => {
            const propertyName = new EmberModule(filePath.replace("./", "")).getClassName();

            if (!propertyName) {
                return "";
            }

            return `
                import ${propertyName} from "${filePath}";
                App.${propertyName} = ${propertyName}
            `;
        });

    content += imports.join("");

    return content;

};
