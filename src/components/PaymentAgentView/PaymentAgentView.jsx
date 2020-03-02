import React from 'react';
import { withTaskContext } from '@twilio/flex-ui';


// It is recommended to keep components stateless and use redux for managing states
class PaymentAgentView extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            workspaceSid: 'WS09ac7e1cd75d778ceea830162da9e9d5',
            token: window.Twilio.Flex.Manager.getInstance().store.getState().flex.session.ssoTokenPayload.token,
            stage: 'init',
            runtimeUrl: 'https://lava-guanaco-9004.twil.io' 
        }
    }

    initiateAAP = () => {
        console.log("Initiating Payment for Call Sid: " + this.props.task.attributes.call_sid);

        var body = {
            workspaceSid: this.state.workspaceSid,
            taskSid: this.props.task.taskSid,
            Token: this.state.token
        }

        var options = {
            method: 'POST', 
            body: new URLSearchParams(body),
            headers: {
                'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };

        fetch(this.state.runtimeUrl + "/aap-begin-pay-session", options)
        .then(success => {
            console.log("Ititiated AAP");
        }).catch(err => {
            console.error("Failed to ititiate AAP");
        });
    }

    requestCapture = (captureField) => {

        var body = {
            workspaceSid: this.state.workspaceSid,
            taskSid: this.props.task.taskSid,
            Token: this.state.token,
            callSid: this.props.task.attributes.call_sid,
            paymentSid: this.props.task.attributes.agentAssistedPayments.PaymentSid,
            capture: captureField
        };

        var options = {
            method: 'POST', 
            body: new URLSearchParams(body),
            headers: {
                'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };

        fetch(this.state.runtimeUrl + "/aap-capture-parameter", options)
        .then(success => {
            this.setState({stage: captureField});
            console.log("PAN Requested");
        }).catch(err => {
            console.error("Failed to request element");
        });
    }

    processPayment = () => {
        console.log("attempting to process payment via Pay Connector");

        var body = {
            workspaceSid: this.state.workspaceSid,
            taskSid: this.props.task.taskSid,
            Token: this.state.token,
            callSid: this.props.task.attributes.call_sid,
            paymentSid: this.props.task.attributes.agentAssistedPayments.PaymentSid,
            status: 'complete'
        };

        var options = {
            method: 'POST', 
            body: new URLSearchParams(body),
            headers: {
                'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };

        fetch(this.state.runtimeUrl + "/aap-complete-pay-session", options)
        .then(success => {
            this.setState({stage: 'complete'});
            console.log("Payment completed successfully");
        }).catch(err => {
            console.error("Failed to complete payment");
        });
    }

    render() {
        const { task } = this.props;
        
        if(task === undefined)
            return null;
    

        console.log("Attributes:");
        console.log(task.attributes);
        
        

        return (
            <div>
                { task.attributes.agentAssistedPayments === undefined && 

                    <>
                    <hr />
                    <div className="main-content">
                        <div class="container-fluid">
                            <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-header-title">Agent Assisted Payments</h4>
                                    </div>
                                    <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <label>BEGIN PAYMENT</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <p>Begin $10 Payment with Stripe?</p>
                                            <button className="btn btn-primary lift" type="button" onClick={this.initiateAAP}>Initiate Agent Assisted Payment</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>

                }  
                {
                 task.attributes.agentAssistedPayments !== undefined 
                 && task.attributes.agentAssistedPayments.Status !== undefined 
                 && task.attributes.agentAssistedPayments.Status.PaymentConfirmationCode !== undefined &&
                 <>
                    <hr />
                    <div className="main-content">
                        <div class="container-fluid">
                            <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-header-title">Pay - Agent Assisted Payment</h4>
                                    </div>
                                    <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <label>Confirmation Code</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <input type="text" className="form-control" readonly="readonly" defaultValue={ task.attributes.agentAssistedPayments.Status.PaymentConfirmationCode } />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 </>
                }
                { this.state.stage != 'complete' && task.attributes.agentAssistedPayments != undefined && 
                    <>
                        <>
                    <div className="main-content">
                    <div class="container-fluid">

<hr />

                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-header-title">Pay - Agent Assisted Payment</h4>
                            </div>
                            <div className="card-body">
                            <form className="mb-4">
                            <div className="row">
                                <div className="col">
                                    <label>Payment Card Number</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <input type="text" className="form-control" readonly="readonly" defaultValue={ task.attributes.agentAssistedPayments.Status.PaymentCardNumber } />
                                    </div>
                                </div>
                                <div className="col">
                                    <button disabled={task.status !== 'accepted'} 
                                        className="btn btn-primary lift" 
                                        type="button" 
                                        onClick={() => this.requestCapture('payment-card-number')}
                                        >
                                            {this.state.stage === 'payment-card-number' ? 'capturing' : (task.attributes.agentAssistedPayments.Status.PaymentCardNumber === undefined ? 'Request Payment Card Number' : 'Re-Request Payment Card Number')}
                                    </button>
                                </div>
                            </div>

                            {task.attributes.agentAssistedPayments.Status.PaymentCardNumber !== undefined && 
                            <>
                            <div className="row">
                                <div className="col">
                                    <label>Expiry Date</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <input type="text" className="form-control" defaultValue={task.attributes.agentAssistedPayments.Status.ExpirationDate}/>
                                    </div>
                                </div>
                                <div className="col">
                                    <button disabled={task.status !== 'accepted'} className="btn btn-primary lift " type="button" onClick={() => this.requestCapture('expiration-date')}>Capture Expiration Date</button>
                                </div>
                            </div>
                            </>
                            }

                            {task.attributes.agentAssistedPayments.Status.ExpirationDate !== undefined && 
                            <>
                            <div className="row">
                                <div className="col">
                                    <label>Security Code</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <input type="text" className="form-control" defaultValue={task.attributes.agentAssistedPayments.Status.SecurityCode}/>
                                    </div>
                                </div>
                                <div className="col">
                                    <button disabled={task.status !== 'accepted'} className="btn btn-primary lift" type="button" onClick={() => this.requestCapture('security-code')}>Capture Security Code</button>
                                </div>
                            </div>
                            </>
                            }

                            {task.attributes.agentAssistedPayments.Status.Required==="" &&
                                <button className="btn btn-primary lift" type="button" onClick={() => this.processPayment()}>Process Payment</button>
                            }
                        </form>
                            </div>
                        
                        
                        </div>
                    </div>
                    </div>
                </>
                    </>
                }
                
            </div>
        );
    };
}
export default withTaskContext(PaymentAgentView);
