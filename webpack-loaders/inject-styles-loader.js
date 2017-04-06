const recursive = require("recursive-readdir-sync");

module.exports = function (content) {

    const
        appDir = "app",
        imports = recursive(appDir).filter(filePath => {
            return /\.scss/.test(filePath) && filePath.split("/").length > 2;
        }).map(filePath => {
            return `@import "~${filePath.replace(appDir + "/", "")}";`;
        });

    content += "\n\n" + imports.join("\n");

    return content;
};
