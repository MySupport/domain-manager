const differenceInDays = require('date-fns/difference_in_days');
const whois = require('whois-json');
const { CronJob } = require('cron');

const { asyncForEach } = require('../utils/asyncForEach');
const { sleep } = require('../utils/sleep');
const { logInfo, logError } = require('./loggingService');
const { ServiceBase } = require('./serviceBase');

const { QUERY_ALL_DOMAINS, MUTATION_SAVE_DOMAIN_WHOIS } = require('./queries');

let cronJob = null;

function disposeCronJob() {
  try {
    cronJob.stop();
  } catch (error) {}
}

class WhoisService extends ServiceBase {
  constructor(keystone) {
    // initialize with domain queue for concurrency and load balancing
    super(keystone);
    WhoisService.instance = this;
    this.startBackgroundTask();
  }

  async scheduledProcessing(force = false) {
    if (this.isRunning) return;

    this.isRunning = true;
    if (force) logInfo('running this scheduled refresh in force mode.');
    /** @type queries.Domain[] */
    const domains = await this.getDomainsForCheck();
    let domainsToCheck = force
      ? domains
      : domains.filter(
          d => !d.registryExpiryDate || differenceInDays(d.registryExpiryDate, Date.now()) < 30
        );

    logInfo(`will be checking ${domainsToCheck.length} for their expiration dates`);
    await asyncForEach(domainsToCheck, async d => {
      const who = await this.getDomainWhois(d.name);
      if (who) {
        await this.saveDomainWhois(d, who);
        logInfo(`saved domain info for: ${d.name}`);
      }
      await sleep(12000);
    });
    this.isRunning = false;
  }

  async startBackgroundTask() {
    logInfo('WhoIs Service started');
    disposeCronJob();
    cronJob = new CronJob({
      cronTime: '0 * * 0 * *',
      onTick: async () => {
        logInfo('starting Scheduled task');
        this.scheduledProcessing();
      },
      start: true,
      runOnInit: true,
    });
    logInfo(`Task Scheduled to run “At 00:00 every day.” Next run at: ${cronJob.nextDate()}`);
  }

  async getDomainsForCheck() {
    const { data: { allDomains = [] } = {}, errors } = await this.executeQuery(QUERY_ALL_DOMAINS);
    if (errors) throw errors;
    return allDomains;
  }

  async saveDomainWhois(domain, whoisInfo, error) {
    try {
      /** @type Partial<queries.Domain> */
      const data = error
        ? {
            lastCheckError: error.message,
            lastCheckedDate: new Date().toISOString(),
          }
        : {
            registryCreationDate: whoisInfo.creationDate,
            registryExpiryDate: whoisInfo.registryExpiryDate,
            registryUpdatedDate: whoisInfo.updatedDate,
            lastCheckedDate: new Date().toISOString(),
            lastCheckError: null,
          };
      const { errors } = await this.executeQuery(MUTATION_SAVE_DOMAIN_WHOIS, {
        id: domain.id,
        data,
      });
      if (errors) throw errors;
    } catch (error) {
      logError(error);
    }
  }

  /**
   * get this from whois call
   * @param {string} domain domain
   */
  async getDomainWhois(domain) {
    try {
      const options = {};
      if (domain.endsWith('.in')) {
        options.server = 'whois.registry.in';
        options.follow = 0;
      }

      const result = await whois(domain, options);
      return result;
    } catch (error) {
      logError(`error in processing domain: ${domain}`);
    }
    return null;
  }
}

WhoisService.instance = null;

module.exports = { WhoisService };
