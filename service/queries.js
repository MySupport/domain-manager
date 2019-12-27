exports.CONFIG_QUERY = `{
  allConfigs {key value encrypted}
}`;

exports.ACTIVE_PROCESS_QUERY_BY_TYPE = `
query allProcesses($type: ProcessTypeType!) {
  allProcesses(where: {active: true, type: $type}) {
    id
    name
    type
    active
  }
}`;

exports.ALL_ACTIVE_PROCESS_QUERY = `{
  allProcesses(where: {active: true}) {
    id
    name
    type
    active
}`;
