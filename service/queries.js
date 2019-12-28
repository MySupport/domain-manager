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

exports.QUERY_ALL_DOMAINS = `
query allDomains {
  allDomains {
    id
    name
    registryCreationDate
    registryExpiryDate
    registryUpdatedDate
    lastCheckedDate
    lastCheckError
  }
}`;

exports.MUTATION_SAVE_DOMAIN_WHOIS = `mutation updateDomain($id: ID!, $data: DomainUpdateInput ){
	updateDomain(id: $id, data: $data) {
    id
  }
}`;