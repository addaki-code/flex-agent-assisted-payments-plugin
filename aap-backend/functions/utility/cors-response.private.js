
exports.response = function(originalResponse) {
    const corsResponse = new Twilio.Response();
    
    corsResponse.appendHeader('Access-Control-Allow-Origin', '*');
    corsResponse.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    corsResponse.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    corsResponse.appendHeader('Content-Type', 'application/json');
    corsResponse.setBody(originalResponse);
    
    return corsResponse;
};