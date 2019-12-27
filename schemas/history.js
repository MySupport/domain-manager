const {
  Text,
  Relationship,
  DateTime,
} = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
const { DEFAULT_LIST_ACCESS } = require('../utils/access');

exports.History = {
  access: DEFAULT_LIST_ACCESS,
  fields: {
    process: { type: Relationship, ref: 'Process', required: true },
    processName: { type: Text },
    status: { type: Wysiwyg },
    whenStarted: { type: DateTime },
    whenFinished: { type: DateTime },
  },
};
