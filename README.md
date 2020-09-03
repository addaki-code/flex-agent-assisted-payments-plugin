# Agent Assisted Payments Flex Plugin

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards, install the dependencies by running `npm install`:

```bash
cd flex-agent-assisted-payments-plugin

cp appConfig.example.js appConfig.js
# Add your account SID

# If you use npm
npm install
```

## Create Sync Service

`twilio api:sync:v1:services:create --friendly-name=payments`

In the Twilio Console, create an API Key for your Sync service: https://www.twilio.com/console/sync/project/api-keys/create. Save the values for the next step.

## Functions

Deploy each of the 4 functions to Twilio Functions with the filename as the URL path.
Click "Enable ACCOUNT_SID and AUTH_TOKEN" on https://www.twilio.com/console/functions/configure
Add your SYNC_SERVICE_SID as a context variable.

Environment variables:
Add TWILIO_API_KEY as a context variable with the value being the API Key SID for your sync service (SKXXXXXXXXXXXXXXXXXX)
Add TWILIO_API_SECRET as a context variable with the value being the API Key secret generated in the previous step.
Add your functions base URL as a DOMAIN_NAME context variable (exclude https://)

Dependencies:

Add the folowing NPM modules as dependencies:

-   twilio-flex-token-validator
-   querystring
-   request-promise

## Voice Configuration

Enable your <Pay /> connector on https://www.twilio.com/console/voice/pay-connectors
Enable PCI mode for your account on https://www.twilio.com/console/voice/settings

## Development

In order to develop locally, you can use the Webpack Dev Server by running:

```bash
npm start
```

This will automatically start up the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:8080`. If you want to change that you can do this by setting the `PORT` environment variable:

```bash
PORT=3000 npm start
```

When you make changes to your code, the browser window will be automatically refreshed.

## Deploy

Once you are happy with your plugin, you have to bundle it in order to deploy it to Twilio Flex.

Run the following command to start the bundling:

```bash
npm run build
```

Afterwards, you'll find in your project a `build/` folder that contains a file with the name of your plugin project. For example, `plugin-example.js`. Take this file and upload it into the Assets part of your Twilio Runtime.

Note: Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex to provide them globally.
