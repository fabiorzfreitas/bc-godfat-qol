const browserify = require("browserify");
const tsify = require("tsify");
const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.dirname(__dirname);

const indexFile = path.join(rootDir, "godfat", "index.ts");
const tmpFile = path.join(rootDir, "tmp", "godfat.js");
const headerFile = path.join(rootDir, "godfat", "header.txt");
const resultFile = path.join(rootDir, "dist", "godfat.user.js");

const tmpFileStream = fs.createWriteStream(tmpFile);

const bundle = browserify()
  .add(indexFile)
  .plugin(tsify, { noImplicitAny: false, files: [] })
  .bundle();

bundle.pipe(tmpFileStream);

bundle.on("error", function (error) {
  console.error("\x1b[31m%s\x1b[0m", error.toString());
  // Ensure the build process exits with an error code
  process.exit(1);
});

tmpFileStream.on("finish", function() {
  const headerData = fs.readFileSync(headerFile, "utf8");
  const scriptData = fs.readFileSync(tmpFile, "utf8");
  const resultData = headerData + scriptData;

  fs.writeFileSync(resultFile, resultData, "utf8");
});
