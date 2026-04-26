const appInsights = require("applicationinsights");

appInsights
  .setup(process.env.APPINSIGHTS_CONNECTION_STRING)
  .start();

const client = appInsights.defaultClient;

const trackEvent = (eventName, properties) => {
  client.trackEvent({
    name: eventName,
    properties,
  });
};

module.exports = { trackEvent };