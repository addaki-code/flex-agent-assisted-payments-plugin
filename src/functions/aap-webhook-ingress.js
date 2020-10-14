exports.handler = function (context, event, callback) {
    console.log("AAP webhook fired for call " + event.CallSid);

    context
        .getTwilioClient()
        .sync.services(context.SYNC_SERVICE_SID)
        .syncLists("aap:" + event.CallSid)
        .syncListItems.create({
            data: event,
        })
        .then((success) => {
            console.log(success);
            callback(null, "Updated");
        })
        .catch((error) => {
            console.log(error);
            callback(error, "Something went wrong");
        });
};
