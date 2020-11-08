export const GetFlexUserToken = () => {
    return window
        .Twilio
        .Flex
        .Manager
        .getInstance()
        .store
        .getState()
        .flex
        .session
        .ssoTokenPayload
        .token;
}

export const GetTokenisedFetchOptions = (body = {}) => {
    
    body.Token = GetFlexUserToken();
    return {
        method: "POST",
        body: new URLSearchParams(body),
        headers: {
            "Content-Type":
                "application/x-www-form-urlencoded;charset=UTF-8",
        },
    };
}