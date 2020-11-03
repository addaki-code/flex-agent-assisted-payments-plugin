# Agent Assisted Payments Flex Plugin

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards, install the dependencies by running `npm install`:

```bash
cd flex-agent-assisted-payments-plugin

# If you use npm
npm install
```

## Creating the Serverless Backend Functions
```bash
cd aap-backend
npm install


```

Make a copy of the .env.example file, call it .env, and populated it with values from Twilio Console

ACCOUNT_SID=
AUTH_TOKEN=
TWILIO_API_SECRET=
TWILIO_API_KEY=
PAYMENT_CONNECTOR=Default
SYNC_SERVICE_SID=

Replace the name of your payment connector with the name you gave to it in the Twilio Console. 
You will need to create a new API Key/Secret using the Twilio Console.
You will be able to find your Account SID, Auth Token, and Sync Service ID in the Twilio console. 

## Deploy Functions

`twilio serverless:deploy`

Wait a few moments, and your functions should be deployed to Twilio Serverless with a domain like:

`aap-backend-XXXX-dev.twil.io`

Make a note of this Domain. You will need it soon.

## Voice Configuration

Enable your <Pay /> connector on https://www.twilio.com/console/voice/pay-connectors
Enable PCI mode for your account on https://www.twilio.com/console/voice/settings
Enter the unique name of your Payment Connector as an environment variable called "PAYMENT_CONNECTOR" in https://www.twilio.com/console/functions/configure

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
