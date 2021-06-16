const { generateRoutes } = require("./routesGenerator");

module.exports.generateAPI = (opts) => {
  return generateRoutes(opts);
};
