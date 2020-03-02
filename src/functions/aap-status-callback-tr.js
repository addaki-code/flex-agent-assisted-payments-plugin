exports.handler = function(context, event, callback) {

    // Enable: Check for valid Twilio signature on this function


	const client = context.getTwilioClient();
	
	console.log("Workspace: " + event.WorkspaceSid);
	console.log("Task:" + event.TaskSid);

	client.taskrouter.workspaces(event.WorkspaceSid)    
    .tasks(event.TaskSid)
    .fetch()
    .then(task => {
        var attributes = JSON.parse(task.attributes);
	    console.log(attributes);
	    
	    attributes.agentAssistedPayments = {
	        PaymentSid: event.Sid,
	        CaptureStage: 'none',
	        Status: event
	    };
	    
	    if(event.Capture !== undefined){
	        attributes.agentAssistedPayments.Status  = event;
        }
	    
	    client.taskrouter.workspaces(event.WorkspaceSid)    
            .tasks(event.TaskSid)
            .update({
                attributes: JSON.stringify(attributes)
            })
            .then(d => {
                console.log("updated");
                callback(null);
            })
            .catch(err => {
                console.log(err);
                callback(err);
            });
    });
            
            
};