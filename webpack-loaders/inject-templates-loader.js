const
    path = require("path"),
    recursive = require("recursive-readdir-sync");

module.exports = function (content) {

    const
        appDir = "app",
        imports = recursive(appDir).filter(filePath => /\.hbs$/.test(filePath)).map(filePath => {
            return `import "${filePath.replace(appDir, ".")}";`;
        });

    content += "\n\n" + imports.join("\n");

    return content;

};