const { Text, DateTime, Virtual } = require('@keystonejs/fields');
const { atTracking } = require('@keystonejs/list-plugins');

const distanceInWordsToNow = require('date-fns/distance_in_words_to_now');

const { DEFAULT_LIST_ACCESS } = require('../utils/access');
const { WhoisService } = require('../service/whoisService');

exports.Domain = {
  access: DEFAULT_LIST_ACCESS,
  fields: {
    name: { type: Text, required: true },
    registryCreationDate: { type: DateTime, format: 'MM/DD/YYYY h:mm A' },
    registryExpiryDate: { type: DateTime, format: 'MM/DD/YYYY h:mm A' },
    registryUpdatedDate: { type: DateTime, format: 'MM/DD/YYYY h:mm A' },
    registryDomainId: { type: Text },
    registrar: { type: Text },
    registrarWhoisServer: { type: Text },
    lastCheckedDate: { type: DateTime, format: 'MM/DD/YYYY h:mm A' },
    expiresIn: {
      type: Virtual,
      resolver: item =>
        (item.registryExpiryDate && `${distanceInWordsToNow(item.registryExpiryDate)}`) || 'N/A',
    },
    registrationAge: {
      type: Virtual,
      resolver: item =>
        (item.registryCreationDate && `${distanceInWordsToNow(item.registryCreationDate)}`) ||
        'N/A',
    },
    lastCheckError: { type: Text },
    whoisData: { type: Text, isMultiline: true },
  },
  hooks: {
    afterChange: ({ operation, updatedItem }) => {
      if (operation === 'create') WhoisService.instance.queueDomains([updatedItem]);
    },
  },
  plugins: [atTracking()],
};
