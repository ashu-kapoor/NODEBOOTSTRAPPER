const fs = require("fs").promises;
const lodash = require("lodash");
const path = require("path");
const Handlebars = require("handlebars");
const prettier = require("prettier");

module.exports.processTemplate = (template, swaggerData, outputDir) => {
  return new Promise((resolve, reject) => {
    console.log(`Processing template ${template.name}`);
    let templateName = template.name.replace(".handlebars", ".js");
    fs.readFile(template.path, "utf8").then((templateData) => {
      if (template.name.indexOf("{{operationId}}">=0)) {
        const templateWritePromises = [];

        if (swaggerData.allMethods && lodash.isArray(swaggerData.allMethods)) {
          //render the files where name also is dynamic for each method
          swaggerData.allMethods.forEach((operation) => {
            const compiledTemplateName = Handlebars.compile(templateName);
            const fileName = path.join(
              outputDir,
              compiledTemplateName(operation)
            );

            templateWritePromises.push(
              saveParsedTemplate(operation, fileName, templateData)
            );
          });
          Promise.all(templateWritePromises).then(resolve, (err) => {
            console.log("Error Creating templates");
            reject(err);
          });
        }
      } else {
        //render the files where name is not dynamic
        saveParsedTemplate(
          swaggerData,
          path.join(outputDir, templateName),
          templateData
        ).then(resolve, reject);
      }
    }, reject);
  });
};

const saveParsedTemplate = (data, filePath, templateData) => {
  return new Promise((resolve, reject) => {
    console.log("Rendering template data");
    const template = Handlebars.compile(templateData);
    const renderedData = template(data);
    const prettyData = prettier.format(renderedData,{parser:'babel'});
    fs.writeFile(filePath, prettyData).then(resolve,err=>{
        console.log(`Writing failed ${filePath}`);
    })
  });
};
