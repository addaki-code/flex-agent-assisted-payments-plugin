exports.handler = function (context, event, callback) {

    console.log(`callback received ${event.CallSid} ${JSON.stringify(event)}`);
    context.getTwilioClient()
        .sync
        .services(context.SYNC_SERVICE_SID)
        .syncLists('aap:' + event.CallSid).syncListItems
        .create({
            data: event
        })
        .then(success => {
            console.log(`sync event success`);
            console.log(success);
            callback(null, 'Updated');
        })
        .catch(error => {
            console.log(`sync event error`);
            console.log(error);
            callback(error, 'Something went wrong');
        });
};

