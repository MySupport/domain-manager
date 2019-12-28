const { Text, Checkbox } = require('@keystonejs/fields');
const { DEFAULT_LIST_ACCESS } = require('../utils/access');
const { cryptr } = require('../config');

exports.Config = {
  access: DEFAULT_LIST_ACCESS,
  fields: {
    key: { type: Text, required: true, isUnique: true },
    value: { type: Text, required: true },
    encrypted: { type: Checkbox },
  },
  hooks: {
    async beforeChange({ resolvedData, existingItem }) {
      if (resolvedData.value) {
        if (resolvedData.encrypted || (existingItem && existingItem.encrypted)) {
          resolvedData.value = cryptr.encrypt(resolvedData.value);
        }
        return;
      }
      if (resolvedData.value === null) {
        resolvedData.encrypted = false;
      }
      if (resolvedData.encrypted === true && !(existingItem && existingItem.encrypted === true)) {
        let value = existingItem && existingItem.value;
        if (value) {
          resolvedData.value = cryptr.encrypt(value);
        } else {
          resolvedData.encrypted = false;
        }
      }
      if (resolvedData.encrypted === false) {
        resolvedData.value = '';
      }
    },
  },
  labelResolver: item => item.key,
};
