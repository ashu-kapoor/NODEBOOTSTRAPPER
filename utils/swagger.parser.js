//Parse swagger to get routes to be consumed by template
module.exports.getRoutesFromSwagger = (verifiedSwagger) => {
  const parsedSwagger = { paths: getPathsFromSwagger(verifiedSwagger.paths) };
  const allMethods = [];
  parsedSwagger.paths.forEach((m) => {
    //const parsedMethod = { ...m, routePath: updatePath(m.path) };
    m.methods.forEach(method=>{
        const parsedMethod = { ...method, routePath: m.path };
        allMethods.push(parsedMethod);
    });
    
  });
  parsedSwagger.allMethods = allMethods;
  //add title to generate api name if not passed
  parsedSwagger.apiName = verifiedSwagger.info.title.split(" ").join("-");
  return { verifiedSwagger, parsedSwagger };
};

const getPathsFromSwagger = (paths) => {
  console.log("Getting paths from Swagger");
  const fetchedPaths = [];
  Object.entries(paths).forEach(([path, payload]) => {
    fetchedPaths.push({ path, methods: getMethodsFromPath(path, payload) });
  });
  return fetchedPaths;
};

const getMethodsFromPath = (path, pathData) => {
  console.log(`Getting methods from path ${path}`);
  const methods = [];
  Object.entries(pathData).forEach(([method, payload]) => {
    methods.push({ path, method, ...payload });
  });
  return methods;
};

const updatePath = (originalPath) => {
  originalPath.replace(/({.*?})/g, (match) => match.replace(/{(.*)}/, ":$1"));
};