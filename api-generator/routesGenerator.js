const {
  checkPathExist,
  loadSwagger,
  loadTemplates,
} = require("../utils/file.utils");
const { getRoutesFromSwagger } = require("../utils/swagger.parser");
const path = require("path");
const { processTemplate } = require("../templates/index");

module.exports.generateRoutes = (opts) => {
  const { output, swagger, apiName } = opts;
  return new Promise((resolve, reject) => {
    checkPathExist(output).then(
      (res) => {
        const swaggerPromise = loadSwagger(swagger).then(verifiedSwagger=>{
            return getRoutesFromSwagger(verifiedSwagger);
        },reject);
        const templatesPromise = loadTemplates(
          path.join("templates", "routes")
        );
        Promise.all([swaggerPromise, templatesPromise]).then(
          ([swaggerInfo, templates]) => {
            const { parsedSwagger, verifiedSwagger } = swaggerInfo;
            // swagger validated and parsed and templates found for routes
            const templatePromises = [];
            //create api folder
            checkPathExist(
              path.join(output, apiName || parsedSwagger.apiName),
              true
            ).then(()=>{
                //create routes folder
                checkPathExist(
                    path.join(output, apiName || parsedSwagger.apiName,"routes" ),
                    true
                  ).then(()=>{
                    templates.forEach((template) => {
                        templatePromises.push(
                          processTemplate(
                            template,
                            parsedSwagger,
                            path.join(output, apiName || parsedSwagger.apiName,"routes")
                            
                          )
                        );
                      });
                      Promise.all(templatePromises).then((res) => {
                        resolve(parsedSwagger);
                      }, reject);
                  },reject);
            },reject);            
          },
          reject
        );
        },reject );

  });
};
