const {
    checkPathExist,
    loadTemplates
  } = require("../utils/file.utils");
  const path = require("path");
  const { processTemplate } = require("../templates/index");

module.exports.generateApp = (opts, parsedSwagger) => {
    const { output, apiName } = opts;
    console.log('Generating controllers');
    return new Promise((resolve, reject) => {
        checkPathExist(
            path.join(output, apiName || parsedSwagger.apiName),
            true
          ).then(()=>{
              //controllers directory created
              const templatesLoadPromise = loadTemplates(
                path.join("templates","app")
              );

              let templatePromises = [];

              templatesLoadPromise.then((templates) => {
                templates.forEach((template) => {
                    templatePromises.push(
                      processTemplate(
                        template,
                        parsedSwagger,
                        path.join(output, apiName || parsedSwagger.apiName)
                        
                      )
                    );
                  });
                  Promise.all(templatePromises).then((res) => {
                    resolve(parsedSwagger);
                  }, reject);

              }, reject);

          }, reject);
    });
}