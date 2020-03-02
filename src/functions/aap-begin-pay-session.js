
const rp = require('request-promise')
const TokenValidator = require('twilio-flex-token-validator').functionValidator;

    // Disable: Check for valid Twilio signature on this function

exports.handler = TokenValidator(function(context, event, callback) {
	const client = context.getTwilioClient();
	// Create a custom Twilio Response
  // Set the CORS headers to allow Flex to make an HTTP request to the Twilio Function
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  

    console.log(context.DOMAIN_NAME);
    
    var authorization = 'Basic ' + Buffer.from(context.ACCOUNT_SID + ':' + context.AUTH_TOKEN).toString('base64');

    console.log(authorization);


    client.taskrouter.workspaces(event.workspaceSid)    
    .tasks(event.taskSid)
    .fetch()
    .then(task => {
        console.log(task);
        var attributes = JSON.parse(task.attributes);

        var paymentsUrl = "https://api.twilio.com/2010-04-01/Accounts/"+context.ACCOUNT_SID+"/Calls/" + attributes.call_sid + "/Payments.json";

        console.log(paymentsUrl);
        console.log('-');
        
        var options = {
            method: 'POST',
            uri: paymentsUrl,
            form: {
                ChargeAmount: 10,
                IdempotencyKey: 1, 
                PostalCode: false,
                StatusCallback: 'https://' + context.DOMAIN_NAME + '/aap-status-callback-tr?TaskSid=' + event.taskSid + '&WorkspaceSid=' + event.workspaceSid,
                Currency:'gbp'
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
    })
    .catch(error => callback(error,response));

});