const { Text, DateTime, Virtual } = require('@keystonejs/fields');
const { atTracking } = require('@keystonejs/list-plugins');

const { DateTimeUtc } = require('@keystonejs/fields-datetime-utc');

const distanceInWordsToNow = require('date-fns/distance_in_words_to_now');

const { DEFAULT_LIST_ACCESS } = require('../utils/access');

exports.Domain = {
  access: DEFAULT_LIST_ACCESS,
  fields: {
    name: { type: Text, required: true },
    registryCreationDate: { type: DateTimeUtc },
    registryExpiryDate: { type: DateTimeUtc },
    registryUpdatedDate: { type: DateTimeUtc },
    lastCheckedDate: { type: DateTime },
    expiresIn: {
      type: Virtual,
      resolver: item =>
        (item.expirationDate && `${distanceInWordsToNow(new Date(item.expirationDate))}`) || 'N/A',
    },
    lastCheckError: { type: Text },
    whoisData: { type: Text, isMultiline: true },
  },
  plugins: [atTracking()],
};
