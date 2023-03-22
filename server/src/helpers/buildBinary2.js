const fs = require('fs-extra');
const { spawn } = require('child_process');
const axios = require('axios');

async function buildAppBinary(appJsPath, projectName, projectId) {
  // Create the project directory
  const projectDir = `./${projectName}`;
  await fs.ensureDir(projectDir);

  // Initialize a new Expo project using npx
  const expoInit = spawn('npx', ['create-expo-app', projectName, '--template', 'blank', '--name', projectName, '--npm', '--yes'], { cwd: projectDir });

  // Error handling
  expoInit.stderr.on('data', (data) => {
    console.error(`npx create-expo-app stderr: ${data}`);
  });

  // On successful Expo project creation
  expoInit.on('close', async (code) => {
    if (code === 0) {
      console.log('Expo project created successfully.');

      // Replace the generated App.js with the custom App.js
      await fs.copy(appJsPath, `${projectDir}/${projectName}/App.js`, { overwrite: true });

      // Update app.json with the provided projectId
      const appJsonPath = `${projectDir}/${projectName}/app.json`;
      const appJson = await fs.readJson(appJsonPath);
      appJson.expo.slug = projectId;
      await fs.writeJson(appJsonPath, appJson, { spaces: 2 });

      // Trigger EAS build using npx
      const easBuild = spawn('npx', ['eas-cli', 'build', '--platform', 'all', '--non-interactive', '--profile', 'release'], { cwd: `${projectDir}/${projectName}` });

      // Error handling
      easBuild.stderr.on('data', (data) => {
        console.error(`npx eas-cli build stderr: ${data}`);
      });

      // On successful EAS build
      easBuild.on('close', (code) => {
        if (code === 0) {
          console.log('EAS build completed successfully.');
        } else {
          console.error(`EAS build failed with code: ${code}`);
        }
      });
    } else {
      console.error(`Expo project creation failed with code: ${code}`);
    }
  });
}
