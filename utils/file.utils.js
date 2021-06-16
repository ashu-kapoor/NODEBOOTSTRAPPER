const fs = require("fs").promises;
const yamlParser = require("yaml");
const swaggerParser = require("@apidevtools/swagger-parser");
const path = require('path');

const checkPathExist = (filePath, createDirectory = false) => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath).then(
      (res) => {
        console.warn(`Exists ${filePath}`);
        resolve();
      },
      (err) => {
        console.warn(`Target path not found ${filePath}`);
        if (createDirectory) {
          console.warn(`Attempting to create directory ${filePath}`);
          fs.mkdir(filePath).then(
            (res) => {
              console.warn(`Directory created ${filePath}`);
              resolve();
            },
            (err) => {
              console.warn(`Directory creation failed ${filePath}`);
              reject(err);
            }
          );
        }
      }
    );
  });
};

const loadSwagger = (filePath) => {
  return new Promise((resolve, reject) => {
    checkPathExist(filePath).then(
      (res) => {
        console.log(`Loading swagger ${filePath}`);
        fs.readFile(filePath, "utf8").then(
          (yamlData) => {
            console.log(`Parsing yaml content ${filePath}`);
            const parsedSwagger = yamlParser.parse(yamlData);
            swaggerParser.validate(parsedSwagger).then(resolve, (err) => {
              console.log(
                `Validating yaml content failed ${filePath} with error ${err}`
              );
              reject(err);
            });
          },
          (err) => {
            console.log(`Error Loading swagger ${filePath}`);
            reject(err);
          }
        );
      },
      (err) => {
        console.log(`Swagger not found ${filePath}`);
        reject(err);
      }
    );
  });
};

const loadTemplates = (pathFile) => {
  return new Promise((resolve, reject) => {
    console.log("Loading route templates");
    checkPathExist(pathFile).then((res) => {
      const files = [];
      fs.readdir(pathFile).then((fileNames) => {
        fileNames.forEach((fileName) => {
          files.push({ path: path.join(pathFile, fileName), name: fileName });
        });
        resolve(files);
      }, reject);
    }, reject);
  });
};

module.exports = { checkPathExist, loadSwagger, loadTemplates };
