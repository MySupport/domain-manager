const access = {
  userIsAdmin: ({ authentication: { item: user } }) => Boolean(user && user.isAdmin),
  userIsCurrentAuth: ({ authentication: { item } }) => {
    if (!item) {
      return false;
    }
    return { id: item.id };
  },
};

// Read: public / Write: admin
const DEFAULT_LIST_ACCESS = {
  create: true, //access.userIsAdmin,
  read: true,
  update: true, //access.userIsAdmin,
  delete: true, //access.userIsAdmin,
};

const adminContext = {
  getListAccessControlForUser: () => true,
  getFieldAccessControlForUser: () => true,
};

const schemaName = 'admin';

module.exports = {
  access,
  adminContext,
  schemaName,
  DEFAULT_LIST_ACCESS,
};
