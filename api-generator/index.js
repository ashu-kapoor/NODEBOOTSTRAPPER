const { resolve } = require("@apidevtools/swagger-parser");
const { generateRoutes } = require("./routesGenerator");
const { generateControllers } = require("./controllerGenerator");
const { generateApp } = require("./appGenerator");

module.exports.generateAPI = (opts) => {
  return new Promise((resolve, reject)=>{
    generateRoutes(opts).then(parsedSwagger=>{
      //Since routes are created that means swagger is verified and API directory created
      Promise.all([generateControllers(opts, parsedSwagger), generateApp(opts, parsedSwagger) ])
      .then(([controllerRes, appRes])=>{resolve(opts.output);},reject);
   }, reject);
  })
};
