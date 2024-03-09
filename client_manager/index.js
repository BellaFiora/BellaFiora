
const { spawn } = require('child_process');

function runtime(process) {
  const runtimeProcess = spawn('node', process, { stdio: 'inherit' });

  runtimeProcess.on('close', (code) => {
    console.log(`La runtime a terminé avec le code de sortie ${code}`);
  });
}

runtime(['./client_manager/runtimes/token.js']);
runtime(['./client_manager/runtimes/users.js']);