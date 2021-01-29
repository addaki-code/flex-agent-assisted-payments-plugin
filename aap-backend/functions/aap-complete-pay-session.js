const TokenValidator = require('twilio-flex-token-validator').functionValidator;
exports.handler = TokenValidator(function (context, event, callback) {

    const client = context.getTwilioClient();
    let cors = require(Runtime.getFunctions()['utility/cors-response'].path);

    console.log(`complete pay session ${event.CallSid} ${event.PaymentSid} ${event.IdempotencyKey}`);

    client.calls(event.CallSid).payments(event.PaymentSid).update({
        status: 'complete',
        idempotencyKey: event.IdempotencyKey,
        statusCallback: 'https://' + context.DOMAIN_NAME + '/aap-webhook-ingress'
    }).then((success) => {
        console.log(`pay session completed`)
        console.log(success);
        callback(null, cors.response(success))
    }).catch(error => {
        console.log(`pay session error`)
        console.error(error);
        callback(error, cors.response(error));
    });

});