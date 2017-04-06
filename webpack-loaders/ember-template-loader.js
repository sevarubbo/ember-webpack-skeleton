const
    path = require("path"),
    compiler = require("components-ember/ember-template-compiler"),
    TemplateCompiler = require("ember-cli-htmlbars"),
    templateTree = new TemplateCompiler("app", {
        isHTMLBars: true,
        templateCompiler: compiler
    });

module.exports = function (content) {

    const
        appPath = "app",
        templatePath = path.relative(path.resolve(appPath), this.resourcePath),
        moduleDir = templatePath.split("/").slice(-3)[0],
        moduleName = templatePath.split("/").slice(-2)[0];

    let templateName = "",
        processedTemplate;

    if (/^(components|common)/.test(moduleDir)) {
        templateName = `components/${moduleName}`;
    } else {
        templateName = templatePath
            .replace("blocks/routes/", "")
            .replace("routes/", "")
            .split("/")
            .slice(0, -1)
            .join("/");
    }

    processedTemplate = templateTree.processString(content, templateName).replace(/^export default Ember\./, "Ember.");

    return `Ember.TEMPLATES["${templateName}"] = ${processedTemplate}`;
};
