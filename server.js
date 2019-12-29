const express = require('express');

const { keystone, apps } = require('./index');
const { port } = require('./config');
const { logAdminRoutes } = require('./utils/index');
const { WhoisService } = require('./service/whoisService');

keystone
  .prepare({ apps, dev: process.env.NODE_ENV !== 'production' })
  .then(async ({ middlewares }) => {
    await keystone.connect();

    const app = express();
    app.use(middlewares);

    app.listen(port, error => {
      if (error) throw error;
      logAdminRoutes(apps, port);
      new WhoisService(keystone);
    });
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
