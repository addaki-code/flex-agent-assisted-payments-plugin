const TokenValidator = require('twilio-flex-token-validator').functionValidator;
exports.handler = TokenValidator(function (context, event, callback) {

    let cors = require(Runtime.getFunctions()['utility/cors-response'].path);

    console.log("starting...");

    const client = context.getTwilioClient();

    console.log("got twilio client");

    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader('Content-Type', 'application/json');

    client
        .sync
        .services(context.SYNC_SERVICE_SID)
        .syncLists
        .create({ uniqueName: 'aap:' + event.CallSid })
        .then(() => {
            console.log("list created. Starting payment");
            client.calls(event.CallSid).payments.create({
                chargeAmount: event.ChargeAmount,
                idempotencyKey: event.IdempotencyKey,
                paymentConnector: context.PAYMENT_CONNECTOR,
                postalCode: false,
                statusCallback: 'https://' + context.DOMAIN_NAME + '/aap-webhook-ingress',
                currency: event.Currency,
                validCardTypes: 'visa mastercard amex',
                paymentMethod: event.PaymentMethod,
                description: event.Description
            }).then((success) => {
                console.log("payment created");
                console.log(success);
                //response.setBody(success);
                return callback(null, cors.response(success));
            }).catch((error) => {
                console.log("unable to create payment");
                console.log(error);
                response.setBody(error);
                return callback(error, response);
            });
        })
        .catch((error) => {
            console.log("coulnt get sync list");

            console.log(error);
            response.setBody(error);
            return callback(error, response);
        });
});