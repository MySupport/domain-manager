const { Text } = require('@keystonejs/fields');
const { atTracking } = require('@keystonejs/list-plugins');
const { WhoisService } = require('../service/whoisService');

exports.WhoisServer = {
  fields: {
    tld: { type: Text, required: true },
    server: { type: Text, required: true },
  },
  hooks: {
    afterChange: () => {
      WhoisService.instance.getDomainServers();
    },
  },
  plugins: [atTracking()],
};
