const { Text, Checkbox, Select } = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
const { DEFAULT_LIST_ACCESS } = require('../utils/access');

exports.Process = {
  access: DEFAULT_LIST_ACCESS,
  fields: {
    name: { type: Text, required: true },
    detail: { type: Wysiwyg },
    type: { type: Select, options: 'domainCheck, alert, hooks' },
    active: { type: Checkbox, defaultValue: false },
  },
};
