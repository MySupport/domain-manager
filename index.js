require('dotenv').config();

const express = require('express');

const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { MongooseAdapter } = require('@keystonejs/adapter-mongoose');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { NextApp } = require('@keystonejs/app-next');
const { StaticApp } = require('@keystonejs/app-static');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sessionStore = new MongoStore({ url: 'mongodb://localhost/domain-check' });
const extendGraphQL = require('./lib/extendGraphQL');

const { appStaticSrc, appStaticPath } = require('./config');
const lists = require('./lists');
const initializeData = require('./initialData');

const keystone = new Keystone({
  name: 'domain check',
  adapter: new MongooseAdapter(),
  onConnect: initializeData,
  sessionStore,
});

extendGraphQL(keystone);

for (let list in lists) {
  keystone.createList(list, lists[list]);
}

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

const adminApp = new AdminUIApp({
  adminPath: '/admin',
  authStrategy,
});

module.exports = {
  keystone,
  apps: [
    {
      prepareMiddleware: () => {
        const app = express();
        app.get('/', (req, res) => res.redirect('/admin'));
        return app;
      }
    },
    new GraphQLApp(),
    new StaticApp({ path: appStaticPath, src: appStaticSrc }),
    adminApp,
  ],
};
