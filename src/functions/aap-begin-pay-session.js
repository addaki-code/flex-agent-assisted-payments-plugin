const rp = require("request-promise");
const qs = require("querystring");
const TokenValidator = require("twilio-flex-token-validator").functionValidator;

exports.handler = TokenValidator(function (context, event, callback) {
    const client = context.getTwilioClient();
    // Create a custom Twilio Response
    // Set the CORS headers to allow Flex to make an HTTP request to the Twilio Function
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    console.log(context.DOMAIN_NAME);

    var authorization =
        "Basic " +
        Buffer.from(context.ACCOUNT_SID + ":" + context.AUTH_TOKEN).toString(
            "base64"
        );

    console.log(authorization);

    client.sync
        .services(context.SYNC_SERVICE_SID)
        .syncLists.create({ uniqueName: "aap:" + event.CallSid })
        .then((d) => {
            var paymentsUrl =
                "https://api.twilio.com/2010-04-01/Accounts/" +
                context.ACCOUNT_SID +
                "/Calls/" +
                event.CallSid +
                "/Payments.json";

            console.log(paymentsUrl);
            console.log("-");

            var options = {
                method: "POST",
                uri: paymentsUrl,
                form: {
                    ChargeAmount: event.ChargeAmount,
                    IdempotencyKey: event.IdempotencyKey,
                    PaymentConnector: context.PAYMENT_CONNECTOR,
                    PostalCode: false,
                    StatusCallback:
                        "https://" +
                        context.DOMAIN_NAME +
                        "/aap-webhook-ingress",
                    Currency: event.Currency,
                },
                headers: {
                    "Content-Type": "application/x-www-form-url-encoded",
                    Authorization: authorization,
                    Accept: "application/json",
                },
            };
            rp(options)
                .then((success) => {
                    response.setBody(success);
                    console.log(success);
                    callback(null, response);
                })
                .catch((error) => {
                    console.log(error);
                    response.setBody(error);
                    callback(error, response);
                });
        });
});
