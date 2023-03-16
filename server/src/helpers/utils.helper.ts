const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

import { buildTemplate } from './appUtils.helper';

export function getTemplate(config) {
  const template = buildTemplate(config);
  return template;
}

export function buildApp(config) {
  const template = getTemplate(config);
  const currentDir = path.resolve(process.cwd());

  const ls = spawn('bash', ['./script.sh'], {
    shell: true,
    cwd: currentDir,
  })

  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data.toString()}`);
    if (data.toString().includes("Build details: ")) {

    }
  });
  
  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  
  ls.on('close', (code) => {
    fs.rmSync(`${currentDir}/my-app`, { recursive: true, force: true });
    console.log(`child process exited with code ${code}`);
  });
}
