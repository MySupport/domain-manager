// eslint-disable-next-line no-unused-vars
const { Keystone } = require('@keystonejs/keystone');

const { CONFIG_QUERY, ACTIVE_PROCESS_QUERY_BY_TYPE } = require('./queries');

exports.ServiceBase = class ServiceBase {
  /**
   *Creates an instance of service base.
   * @param {Keystone} keystone
   * @memberof ServiceBase
   */
  constructor(keystone) {
    this.keystone = keystone;
  }

  /**
   *
   *
   * @param {*} query
   * @param {*=} variables
   * @returns { Promise<{data: any, errors?: any}> }
   */
  async executeQuery(query, variables) {
    // @ts-ignore
    return this.keystone.executeQuery(query, { variables });
  }

  /**
   * Get Active processes
   * @returns { Promise<{ allConfigs: queries.Config[], errors: Object }>}
   */
  async getConfigs() {
    const { data: { allConfigs } = { allConfigs: [] }, errors } = await this.executeQuery(
      CONFIG_QUERY
    );
    return { allConfigs, errors };
  }

  /**
   * Get Active processes
   * @returns { Promise<{ processes: queries.Process[], errors: Object }>}
   */
  async getActiveProcessesByType(type) {
    const { data: { allProcesses } = { allProcesses: [] }, errors } = await this.executeQuery(
      ACTIVE_PROCESS_QUERY_BY_TYPE,
      { type }
    );
    return { processes: allProcesses, errors };
  }
};
