const TokenValidator = require('twilio-flex-token-validator').functionValidator;
exports.handler = TokenValidator(function (context, event, callback) {

    const client = context.getTwilioClient();
    let cors = require(Runtime.getFunctions()['utility/cors-response'].path);

    console.log(`capture parameters ${event.Capture} ${event.IdempotencyKey}`);

    client.calls(event.CallSid).payments(event.PaymentSid).update({
        capture: event.Capture,
        idempotencyKey: event.IdempotencyKey,
        statusCallback: 'https://' + context.DOMAIN_NAME + '/aap-webhook-ingress'
    }).then((success) => {
        console.log(`capture parameter success`);
        console.log(success);
        callback(null, cors.response(success))
    }).catch(error => {
        console.log(`capture parameter error`);
        console.error(error);
        callback(error, cors.response(error));
    });

});