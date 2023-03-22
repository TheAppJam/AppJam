const queue = require('queue');
const buildQueue = queue({ concurrency: 1 }); // Adjust the concurrency based on your server capacity

// Wrap your buildAppBinary function in a new function that takes a callback
function buildAppBinaryWithCallback(appJsPath, projectName, projectId, callback) {
  buildAppBinary(appJsPath, projectName, projectId)
    .then(() => {
      callback(null, 'Build completed successfully.');
    })
    .catch((error) => {
      callback(error, null);
    });
}

// Enqueue build requests
function enqueueBuild(appJsPath, projectName, projectId) {
  buildQueue.push((callback) => {
    console.log(`Starting build for project: ${projectName}`);
    buildAppBinaryWithCallback(appJsPath, projectName, projectId, (error, result) => {
      if (error) {
        console.error(`Build failed for project: ${projectName}`);
      } else {
        console.log(`Build completed for project: ${projectName}`);
      }
      callback(); // This is important to signal the queue to process the next item
    });
  });
}

// Start the build queue
buildQueue.start();
