const differenceInDays = require('date-fns/difference_in_days');
const whois = require('@mysupport/whois');
const { CronJob } = require('cron');
const parseDomain = require('parse-domain');

const { sleep } = require('../utils/sleep');
const { logInfo, logError } = require('./loggingService');
const { ServiceBase } = require('./serviceBase');

const {
  QUERY_ALL_DOMAINS,
  MUTATION_SAVE_DOMAIN_WHOIS,
  QUERY_ALL_WHOIS_SERVERS,
} = require('./queries');

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
    /** @type queries.Domain[] */
    this.domainsQueue = [];
    this.domainServers = {};
    this.startBackgroundTask();
  }

  async scheduledProcessing(force = false) {
    if (this.isRunning) return;

    if (force) logInfo('running this scheduled refresh in force mode.');
    /** @type queries.Domain[] */
    const domains = await this.getDomainsForCheck();
    let domainsToCheck = force
      ? domains
      : domains.filter(
          d => !d.registryExpiryDate || differenceInDays(d.registryExpiryDate, Date.now()) < 30
        );
    await this.getDomainServers();
    logInfo(`will be checking ${domainsToCheck.length} domains expiring in next 30 days to refresh them`);
    if (domainsToCheck.length) {
      this.queueDomains(domainsToCheck);
    }
  }

  async startBackgroundTask() {
    logInfo('WhoIs Service started');
    disposeCronJob();
    cronJob = new CronJob({
      cronTime: '00 00 00 * * *',
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
    if (errors) logError(errors);
    return allDomains;
  }

  /**
   * check for domains
   * @param {queries.Domain[]} domains domains
   */
  async queueDomains(domains = []) {
    this.domainsQueue.push(...domains);

    if (this.domainsQueue.length && !this.isRunning) {
      this.checkDomainWhois();
    }
  }

  async checkDomainWhois() {
    if (this.domainsQueue.length === 0) {
      this.isRunning = false;
      return;
    }
    let counter = 0;
    this.isRunning = true;
    let d = this.domainsQueue.shift();
    while (d) {
      const { who, error } = await this.getDomainWhois(d.name);
      counter++;
      await this.saveDomainWhois(d, who, error);
      logInfo('waiting for 12 seconds for next call');
      await sleep(12000); // REF: needed to prevent whois server rate limiting, ideally it should be per whois server (ip).
      logInfo('waking after 12 seconds of sleep');
      d = this.domainsQueue.shift();
    }
    logInfo(`finishing up this stretch, processed: ${counter} domains`);
    this.isRunning = false;
  }

  async saveDomainWhois(domain, whoisInfo, error) {
    try {
      /** @type Partial<queries.Domain> */
      const data = error
        ? {
            lastCheckError: error,
            lastCheckedDate: new Date().toISOString(),
          }
        : {
            registryCreationDate: whoisInfo.creationDate,
            registryExpiryDate: whoisInfo.registryExpiryDate,
            registryUpdatedDate: whoisInfo.updatedDate,
            registrar: whoisInfo.registrar,
            registryDomainId: whoisInfo.registryDomainId,
            registrarWhoisServer: whoisInfo.registrarWhoisServer,
            lastCheckedDate: new Date().toISOString(),
            whoisData: whoisInfo.rawWhois,
            lastCheckError: null,
          };
      const { errors } = await this.executeQuery(MUTATION_SAVE_DOMAIN_WHOIS, {
        id: domain.id,
        data,
      });
      if (errors) throw errors;
      logInfo(`saved domain info for: ${domain.name}${error ? `with error ${error}` : ''}`);
    } catch (err) {
      logError(err);
    }
  }

  async getDomainServers() {
    const { data: { allWhoisServers = [] } = {}, errors } = await this.executeQuery(
      QUERY_ALL_WHOIS_SERVERS
    );
    if (errors) {
      logError(errors);
      return;
    }
    const servers = allWhoisServers.reduce((accumulator, current) => {
      accumulator[current.tld] = current.server;
      return accumulator;
    }, {});
    this.domainServers = servers || {};
  }

  /**
   * get this from whois call
   * @param {string} domain domain
   */
  async getDomainWhois(domain) {
    try {
      const options = { follow: 0 };
      const parsed = parseDomain(domain);
      if (parsed && parsed.tld && this.domainServers[parsed.tld]) {
        options.server = this.domainServers[parsed.tld];
      }

      const who = await whois(domain, options);
      if (who && Object.keys(who).length === 0) {
        return { who: null, error: 'empty result, retry later' };
      }
      return { who };
    } catch (error) {
      logError(`error in processing domain: ${domain}, error: ${error.message || error}`);
      return { who: null, error: error.message || error };
    }
  }
}

/** @type WhoisService */
WhoisService.instance = null;

module.exports = { WhoisService };
