const { WhoisService } = require('../service/whoisService');

module.exports = keystone => {
  keystone.extendGraphQLSchema({
    mutations: [
      {
        schema: `refreshAll: String`,
        resolver: () => WhoisService.instance.scheduledProcessing(),
      },
      {
        schema: `forceRefreshAll: String`,
        resolver: () => WhoisService.instance.scheduledProcessing(true),
      },
      // {
      //   schema: `refreshSelected(names: [String!]!): ProcessInfo!`,
      //   resolver: (_, { name }) => externalProcessManager.ExecProcess(name),
      // },
    ],
  });
};
