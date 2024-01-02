
const fs = require('fs-extra');
const path = require('path');
const filesToDelete = ['config.ini', 'gosumemory.exe', 'presence.conf'];
const packageJsonPath = path.join(__dirname, 'package.json');


fs.readFile(packageJsonPath, 'utf-8', (err, data) => {
    if (err) {
      console.error(`Error: ${err.message}`);
      return;
    }
    const packageJson = JSON.parse(data);
    const currentVersion = packageJson.version;
    const versionParts = currentVersion.split('.');
    versionParts[2] = (parseInt(versionParts[2]) + 1).toString();
    packageJson.version = versionParts.join('.');
    const currentDirectory = __dirname;
    const destinationDirectory = path.join(__dirname, `../../bellafioraVersions/${packageJson.version}`);
    
    fs.copy(currentDirectory, destinationDirectory)
    filesToDelete.forEach((file) => {
      const filePath = path.resolve(__dirname, file);
      try {
        fs.unlinkSync(filePath);

      } catch (err) {}
    });
    if (!packageJson.build) {
      packageJson.build = {};
    }
    const updatedPackageJson = JSON.stringify(packageJson, null, 2);
    fs.writeFile(packageJsonPath, updatedPackageJson, 'utf-8', (err) => {
      if (err) {
        return;
      }
    });
  });


console.log('Done');
