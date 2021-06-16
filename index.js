const path = require("path");
const yargs = require("yargs");
const { execSync } = require("child_process");
const { generateAPI } = require("./api-generator");

yargs
  .option("swagger", { alias: "s", describe: "Path of swagger.yaml" })
  .option("api-name", { alias: "a", describe: "overwrite api name" })
  .demandOption(["output", "swagger"], "Please provide swagger and output path")
  .command(
    "$0 <output> [options]",
    "Generate the API from swagger",
    (args) => {
      args
        .usage("\nUsage: $0 <output> [options]\n")
        .example("$0 ./routes --swagger ./swagger.yaml");
    },
    (argv) => {
      const { output, swagger, apiName } = argv;
      generateAPI({ output, swagger, apiName })
        .then((data) => {
          console.info("Api generated at: " + data);
        })
        .catch((err) => {
          console.error("Error Occurred while generating API: " + err);
        });
    }
  )
  .version(false)
  .help("help", "Show usage instructions").argv;
