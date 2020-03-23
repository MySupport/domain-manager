const { Text, Password, Checkbox } = require('@keystonejs/fields');

const { access } = require('../utils/access');

exports.User = {
  access: {
    update: access.userIsCurrentAuth,
    delete: access.userIsAdmin,
  },
  fields: {
    name: { type: Text, required: true },
    email: { type: Text, required: true, isUnique: true },
    password: { type: Password, required: true },
    isAdmin: { type: Checkbox, access: { update: access.userIsAdmin } },
  },
};
