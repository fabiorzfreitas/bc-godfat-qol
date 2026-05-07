const browserify = require("browserify");
const tsify = require("tsify");
const fs = require("fs");
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

bundle.on("error", function(error) {
  console.error(error.toString());
});

tmpFileStream.on("finish", function() {
  const headerData = fs.readFileSync(headerFile, "utf8");
  const scriptData = fs.readFileSync(tmpFile, "utf8");
  const resultData = headerData + scriptData;

  fs.writeFileSync(resultFile, resultData, "utf8");
});
