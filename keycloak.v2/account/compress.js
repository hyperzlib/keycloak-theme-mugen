const fs = require('fs');
const path = require('path');

const {minify} = require("terser");

let resDir = __dirname + "/resources";

function walkSync(currentDirPath, callback) {
  let fs = require('fs'),
    path = require('path');
  fs.readdirSync(currentDirPath).forEach(function (name) {
    let filePath = path.join(currentDirPath, name);
    let stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

walkSync(resDir, (file) => {
  if (file.match(/\.js$/)) {
    fs.readFile(file, {encoding: 'utf-8'},(err, data) => {
      if (err != null) {
        console.error(err);
        return;
      }
      minify(data).then((result) => {
        fs.writeFile(file, result.code, (err) => {
          if (err != null) {
            console.error(err);
          }
        })
      })
    });
  }
});
