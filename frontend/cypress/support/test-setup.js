const { spawn } = require('child_process');
const waitOn = require('wait-on');

function startApiServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['../backend/server.js'], {
      stdio: 'inherit',
      shell: true
    });

    waitOn({
      resources: ['http://localhost:3000/api/exams'],
      timeout: 30000,
    }).then(() => {
      console.log('API Server is running');
      resolve(server);
    }).catch((err) => {
      console.error('API Server failed to start:', err);
      reject(err);
    });
  });
}

module.exports = {
  startApiServer
};