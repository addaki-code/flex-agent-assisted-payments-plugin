const rp = require('request-promise')
const TokenValidator = require('twilio-flex-token-validator').functionValidator;


    // Disable: Check for valid Twilio signature on this function


exports.handler = TokenValidator(function(context, event, callback) {
	const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    const client = context.getTwilioClient();
    var authorization = 'Basic ' + Buffer.from(context.ACCOUNT_SID + ':' + context.AUTH_TOKEN).toString('base64');
    
    var paymentsUrl = "https://api.twilio.com/2010-04-01/Accounts/"+context.ACCOUNT_SID+"/Calls/" + event.callSid + "/Payments/" + event.paymentSid + ".json";

    
    var options = {
            method: 'POST',
            uri: paymentsUrl,
            form: {
                Status: 'complete',
                IdempotencyKey: 1, 
                StatusCallback: 'https://' + context.DOMAIN_NAME + '/aap-status-callback-tr?TaskSid=' + event.taskSid + '&WorkspaceSid=' + event.workspaceSid,
            },
            headers: {
                'Content-Type': 'application/x-www-form-url-encoded',
                'Authorization': authorization,
                'Accept': 'application/json'
            }
        }
        
    rp(options)
        .then(success => {
            response.setBody(success);
            console.log(success); callback(null, response) })
        .catch(error => { 
            response.setBody(error);
            callback(error, response) });
});