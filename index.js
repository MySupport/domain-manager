require('dotenv').config();

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

const { appStaticSrc, appStaticPath } = require('./config');
const schemas = require('./schemas');
const initializeData = require('./initialData');

const keystone = new Keystone({
  name: 'domain check',
  adapter: new MongooseAdapter(),
  onConnect: initializeData,
  sessionStore,
});

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

for (let list in schemas) {
  keystone.createList(list, schemas[list]);
}

const adminApp = new AdminUIApp({
  adminPath: '/admin',
  hooks: require.resolve('./app/admin/'),
  enableDefaultRoute: true,
  authStrategy,
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new StaticApp({ path: appStaticPath, src: appStaticSrc }),
    adminApp,
    // new NextApp({ dir: 'app' }),
  ],
};
