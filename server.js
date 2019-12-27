const express = require('express');
const fs = require('fs');
const https = require('https');

const { keystone, apps } = require('./index');
const { port } = require('./config');
const { logAdminRoutes } = require('./utils/index');
const { DataService } = require('./service/dataService');

keystone
  .prepare({ apps, dev: process.env.NODE_ENV !== 'production' })
  .then(async ({ middlewares }) => {
    await keystone.connect();

    DataService.SetKeystone(keystone);

    const app = express();
    app.use(middlewares);

    https
      .createServer(
        {
          key: fs.readFileSync('cert.key'),
          cert: fs.readFileSync('cert.pem'),
        },
        app
      )
      .listen(port, error => {
        if (error) throw error;
        logAdminRoutes(apps, port);
        console.log(`App listening on https port 3000! Go to https://localhost:${port}/`);
      });
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
