// eslint-disable-next-line import/no-extraneous-dependencies
const requestPromise = require('request-promise');

const Defaults = require('./LoggerDefaults');
const FunctionLogger = require('./FunctionLogger');

class RequestLogger {
  /**
   * @description Sends two log entries for an HTTP request using the request-promise package: 'begin' and either 'end'
   *  or 'error.' See FunctionLogger.execute() for a more detailed description.
   *
   * @param {Object} logger
   * @param {Object} options request options
   * @param {Function} [isError]
   * @return {Promise} Value returned by request()
   */
  static request(logger, options, isError) {
    let { url } = options;
    if (options.qs && Object.keys(options.qs).length) url = `${url}?${JSON.stringify(options.qs)}`;

    // Strip the protocol
    const snippet = `${options.method} ${url.replace(/^[^:]+:\/\//, '').substr(0, Defaults.maxMessageLength)}`;

    const begin = {
      options,
      message: `Begin: ${snippet}`,
    };

    // @todo errorMessage should be a function that logs the status code in StatusCodeError
    return FunctionLogger.execute(
      logger.child('http'),
      () => requestPromise(options),
      begin,
      `End: ${snippet}`,
      snippet,
      isError
    );
  }
}

module.exports = RequestLogger;