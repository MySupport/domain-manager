const { asyncForEach } = require('../utils/asyncForEach');
const { logInfo, logError } = require('./loggingService');

// const { adminContext, schemaName } = require('../utils/access');
// const {
// } = require('./queries');


/** @type DataService */
let dataService = null;

class DataService {
  constructor(keystone) {
    this.keystone = keystone;
    this.executeQuery = keystone.executeQuery;
  }
  static SetKeystone(keystone) {
    dataService = new DataService(keystone);
  }

  async execute(query, variables) {
    return await this.executeQuery(query, { variables });
  }

  static async Execute(query, variables) {
    return await dataService.execute(query, variables);
  }
}

module.exports = { DataService };
