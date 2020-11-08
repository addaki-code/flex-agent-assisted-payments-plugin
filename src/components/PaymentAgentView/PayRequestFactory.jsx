import { GetTokenisedFetchOptions } from '../../util/FlexUtil'
import config from '../../payConfig.json'

export const PayInitiateRequest = (payload) => {
    
    var baseUrl = config.RUNTIME_URL;
    var payRequest = new Request(
        baseUrl + "/aap-begin-pay-session", 
        GetTokenisedFetchOptions(payload)
    );

    return payRequest;
}

export const PayCaptureParameter = (payload) => {
    var baseUrl = config.RUNTIME_URL;
    var payRequest = new Request(
        baseUrl + "/aap-capture-parameter", 
        GetTokenisedFetchOptions(payload)
    );
    return payRequest;
}

export const PayCompleteSession = (payload) => {
    var baseUrl = config.RUNTIME_URL;
    var payRequest = new Request(
        baseUrl + "/aap-complete-pay-session", 
        GetTokenisedFetchOptions(payload)
    );
    return payRequest;
}

