const TokenValidator = require('twilio-flex-token-validator').functionValidator;
exports.handler = TokenValidator(function (context, event, callback) {

    const client = context.getTwilioClient();
    let cors = require(Runtime.getFunctions()['utility/cors-response'].path);

    console.log(`capture parameters ${event.Capture} ${event.IdempotencyKey}`);

    console.log(`conference sid: ${event.ConfSid}`);
    const annUrl = 'https://' + context.DOMAIN_NAME + '/' + event.Capture + '.xml';

    console.log(`announcement URL ${annUrl}`);

    client.conferences(event.ConfSid)
        .update({announceUrl: annUrl})
        .then((conference) => {
            console.log(`modified conference: ${conference.friendlyname} ${JSON.stringify(conference)}`)
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
        }).catch(error => {
            console.log(`conference error`);
            console.error(error);
            callback(error, cors.response(error));
        })

});