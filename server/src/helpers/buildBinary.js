const fs = require('fs-extra');
const { exec } = require('child_process');
const axios = require('axios');

async function buildReactNativeApp(appJsContent) {
  try {
    // Create a temporary directory for the Expo project
    const tempDir = './tempExpoProject';
    await fs.ensureDir(tempDir);

    // Initialize a new Expo project
    await new Promise((resolve, reject) => {
      exec(`expo init --template blank --name MyApp --npm --non-interactive ${tempDir}`, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          console.log(stdout);
          resolve();
        }
      });
    });

    // Replace the generated App.js with the user's App.js content
    await fs.writeFile(`${tempDir}/App.js`, appJsContent);

    // Login to Expo (Replace 'username' and 'password' with your Expo credentials)
    await new Promise((resolve, reject) => {
      exec(`expo login -u 'username' -p 'password' --non-interactive`, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          console.log(stdout);
          resolve();
        }
      });
    });

    // Build the app binary using Expo EAS Build service
    await new Promise((resolve, reject) => {
      exec(`cd ${tempDir} && eas build --platform android`, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          console.log(stdout);
          resolve();
        }
      });
    });

    // Get the build ID from the output
    const buildId = /https:\/\/expo\.io\/builds\/(\w+)/.exec(stdout)?.[1];
    if (!buildId) {
      throw new Error('Failed to get the build ID');
    }

    // Poll the build status until it's completed
    let buildStatus = 'inProgress';
    while (buildStatus === 'inProgress') {
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for 10 seconds
      const buildStatusResponse = await axios.get(`https://expo.io/--/api/v2/builds/${buildId}`);
      buildStatus = buildStatusResponse.data.status;
    }

    // Download the app binary
    if (buildStatus === 'finished') {
      const binaryUrl = buildStatusResponse.data.artifacts.url;
      const response = await axios.get(binaryUrl, { responseType: 'stream' });
      const outputFilePath = './app-binary.apk';
      const writer = fs.createWriteStream(outputFilePath);
      response.data.pipe(writer);

      // Wait for the download to complete
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      console.log(`App binary downloaded at ${outputFilePath}`);
    } else {
      throw new Error('Build failed');
    }
  } catch (error) {
    console.error('Error during the build process:', error);
  }
}