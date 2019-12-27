var Service = require('node-windows').Service;
const path = require('path');

const argv = require('yargs').argv;

let mode = 'install';

if (argv.mode && argv.mode === 'uninstall') {
  mode = 'uninstall';
}

// Create a new service object
var svc = new Service({
  name: 'Domain Check Service',
  description: 'Checks domain name expiration',
  script: path.join(__dirname, '../server.js'),
  env: [
    {
      name: 'NODE_ENV',
      value: 'development',
    },
    {
      name: 'DISABLE_LOGGING',
      value: 'true',
    },
  ],
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function() {
  svc.start();
  console.log('installed Service');
});

svc.on('alreadyuninstalled', function() {
  console.log('Already installed, uninstall and then install again');
});

if (mode === 'install') {
  svc.install();
} else {
  // Listen for the "uninstall" event so we know when it's done.
  svc.on('uninstall', function() {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
  });

  // Uninstall the service.
  svc.uninstall();
}
