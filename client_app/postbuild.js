const fs = require('fs-extra');
const path = require('path');
const { version } = require('./package.json');
const postbuildDirectory = __dirname;
const exeOutputDirectory = path.join(__dirname, '../../exeOutput');
const destinationDirectory = path.join(__dirname, `../../bellafioraVersions/${version}`);

const executableName = `Bella Fiora Setup v${version}.exe`;
const executablePath = path.join(exeOutputDirectory, executableName);
if (fs.existsSync(executablePath)) {
  fs.ensureDirSync(destinationDirectory);
  fs.copySync(executablePath, path.join(destinationDirectory, executableName));
} 
const gosumemoryExePath = path.join(__dirname, 'misc', 'software', 'gosumemory.exe');
const destinationGosumemoryExePath = path.join('gosumemory.exe');
const configIniPath = path.join(__dirname, 'misc', 'software', 'config.ini');
const destinationConfigIniPath = path.join(__dirname, 'config.ini');

if (fs.existsSync(gosumemoryExePath)) {
  fs.copySync(gosumemoryExePath, destinationGosumemoryExePath);
}

if (fs.existsSync(configIniPath)) {
  fs.copySync(configIniPath, destinationConfigIniPath);
} 