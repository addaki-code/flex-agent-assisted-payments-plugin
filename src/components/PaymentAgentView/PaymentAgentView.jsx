import React from 'react';
import { withTaskContext, ThemeColorsDefinitionCreator } from '@twilio/flex-ui';
import { SyncClient } from 'twilio-sync';


// It is recommended to keep components stateless and use redux for managing states
class PaymentAgentView extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            token: window.Twilio.Flex.Manager.getInstance().store.getState().flex.session.ssoTokenPayload.token,
            runtimeUrl: 'https://lava-guanaco-9004.twil.io',
            paymentSid: null,
            aapStatus: [],
            captureField: undefined,
            paymentMethod: 'credit-card',
            isDisplayed: false,
            showPaymentForm: false,
            paymentAmount: 10,
            taskAttributes: {
                screenPopTitle: 'Testing Auto Generated Interface',
                screenPopSubtitle: 'Testing Auto Generated Subtitle',
                screenPopFields: [
                    {
                        key: "Customer Name",
                        value: "Jonathan Field"
                    },
                    {
                        key: "Loyalty Level",
                        value: "Diamond Member"
                    },
                    {
                        key: 'Member Since',
                        value: '12-Jan-2005'
                    }
                ],
                screenPopTable: {
                    title: 'Active Incidents',
                    columns: ['Incident','Description','Priority','Configuration Item','Creation Date'],
                    rows: 
                    [
                        { values: ['INC1231', 'It has all gone wrong!','1','CMBD_22','12-Jan-2020'] },
                        { values: ['INC1232', 'It has all gone wrong!','2','CMBD_22','12-Jan-2020'] },
                        { values: ['INC1233', 'It has all gone wrong!','3','CMBD_22','12-Jan-2020'] },
                        { values: ['INC1234', 'It has all gone wrong!','4','CMBD_22','12-Jan-2020'] },
                        { values: ['INC1235', 'It has all gone wrong!','5','CMBD_22','12-Jan-2020'] }
                    ]
                }
            }
        };

        window.Twilio.Flex.Actions.addListener("afterAcceptTask", (payload) => {
            this.setState(
                {   paymentSid: null, 
                    aapStatus: [], 
                    captureField: undefined, 
                    paymentMethod: 'credit-card', 
                    isDisplayed: false, 
                    showPaymentForm: false
                });
        });

        this.paymentAmountRef = React.createRef();


        window.Twilio.Flex.CallCanvasActions.Content.add(<button onClick={this.showPaymentForm} className='Twilio-IconButton Twilio-CallCanvas-Dialpad css-w77p7x' key="pay-btn">PAY</button>);
    }



    addEventToState = (newItem) => {
        this.setState({ aapStatus: [...this.state.aapStatus, newItem]} );
    }

    
    
    subscribeToSync = (token) => {
        console.log('Subscribing to Sync list for aap:' + this.props.task.attributes.call_sid);
        var sync = new SyncClient(token);
        sync.list('aap:' + this.props.task.attributes.call_sid)
        .then(list => {
          console.log('Successfully opened a List. SID: ' + list.sid);
          
          
          list.getItems({ from: 0, order: 'asc' })
            .then(paginator => {
                console.log(paginator);
                paginator.items.forEach(item => {
                    console.log(item);
                    this.addEventToState(item.data.value)
                });
            })
            .catch(function(error) {
              console.error('List getItems() failed', error);
            });

          list.on('itemAdded', (event) => {
            console.log('Received itemAdded event: ', event);
            this.addEventToState(event.item.data.value);
        });
        })
        .catch(function(error) {
          console.log('Unexpected error', error);
        });
    }

    showPaymentForm = () => {
        this.setState({ showPaymentForm: true });
    }

    initiateAAP = () => {
        console.log("Initiating Payment for Call Sid: " + this.props.task.attributes.call_sid);

        var options = { method: 'POST' };

        fetch(this.state.runtimeUrl + "/sync-token", options)
            .then(token => {
                token.json().then(json => {
                    console.log("Token: " + json.token);  

                    // Now post to Begin Session
                    var body = {
                        Token: this.state.token,
                        CallSid: this.props.task.attributes.call_sid,
                        ChargeAmount: this.paymentAmountRef.current.value
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
                        console.log("Initiated AAP");
                        success.json().then(response => {
                            console.log(response);
                            this.setState({ paymentSid: response.sid, isDisplayed: true, showPaymentForm: false });
                            this.subscribeToSync(json.token);

                        })    
                    }).catch(err => {
                        console.error("Failed to initiate AAP");
                    });


                });
            })
            .catch(error => {
                console.error(error)
            });
    }



    requestCapture = (captureField) => {
        var body = {
            Token: this.state.token,
            CallSid: this.props.task.attributes.call_sid,
            PaymentSid: this.state.paymentSid,
            Capture: captureField
        };

        console.log("Requesting capture of field")
        console.log(body);

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
            console.log(success)
        }).catch(err => {
            console.log("Failed to request element");
            console.log(err);
        });
    }

    processPayment = () => {
        console.log("attempting to process payment via Pay Connector");

        var body = {
            Token: this.state.token,
            callSid: this.props.task.attributes.call_sid,
            paymentSid: this.state.paymentSid,
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
            console.log("Payment completed successfully");
        }).catch(err => {
            console.log("Failed to complete payment");
        });
    }

    latestPaymentState = () => {
        console.log("Length of AAP Status: " + this.state.aapStatus.length);
        if(this.state.aapStatus.length === 0) return null;
        return this.state.aapStatus[this.state.aapStatus.length - 1];
    }


    // TODO: Move to subcomponent
    renderInput = (friendlyName, pascalCaseName, riverCaseName) => {
        
        var paymentState = this.latestPaymentState();

        return (
        <div>
        
            <span className='Twilio'>{friendlyName}</span>
            <div>{ paymentState[pascalCaseName] }</div>
            <button 
                className="btn btn-sm btn-primary lift" 
                type="button" 
                onClick={() => this.requestCapture(riverCaseName)}
                >Request Capture</button> 
        </div>);
    }



    /*
    screenPopTable: {
                    title: 'Active Incidents',
                    columns: ['Incident','Description','Priority','Configuration Item','Creation Date'],
                    rows: 
                    [
                        { values: ['INC1231', 'It has all gone wrong!','1','CMBD_22','12-Jan-2020'] },
                        { values: ['INC1232', 'It has all gone wrong!','2','CMBD_22','12-Jan-2020'] },
                        { values: ['INC1233', 'It has all gone wrong!','3','CMBD_22','12-Jan-2020'] },
                        { values: ['INC1234', 'It has all gone wrong!','4','CMBD_22','12-Jan-2020'] },
                        { values: ['INC1235', 'It has all gone wrong!','5','CMBD_22','12-Jan-2020'] }
                    ]
                }
    
    */
    renderAutoScreenPop = () => {
        return (
            <>
                <h1>{this.state.taskAttributes.screenPopTitle}</h1>
                <h2>{this.state.taskAttributes.screenPopSubtitle}</h2>
                <hr />
                <table class='table'>
                    { this.state.taskAttributes.screenPopFields.map((fields) => {
                        return (<tr><th><strong>{fields.key}</strong></th><td>{fields.value}</td></tr>)
                    }) 
                    }
                </table>
                { this.state.taskAttributes.screenPopTable !== undefined && (
                    <>
                        <hr />
                        <h3>{ this.state.taskAttributes.screenPopTable.title }</h3>
                        <table class='table'>
                            <tr>
                                {this.state.taskAttributes.screenPopTable.columns.map((column) => {
                                    return (<th>{column}</th>)
                                })}
                            </tr>
                            {
                                    this.state.taskAttributes.screenPopTable.rows.map((row) => {
                                        return (<tr>
                                            { row.values.map((col) => {
                                                return <td>{col}</td>
                                            }) }
                                        </tr>)
                                    })
                                }
                        </table>
                    </>
                )}
            </>
        );
    }

    render() {
        const { task } = this.props;
        
        if(task === undefined) {
            return null;
        }

        console.log("Attributes:");
        console.log(task.attributes);
        
        var paymentState = this.latestPaymentState();

        if(this.state.showPaymentForm){
            return(
                <>
                    <div style={{padding:'5px'}}>
                        <h1 class="Twilio Twilio-TaskCanvasHeader css-cx2jmb">Request Payment via Telephone</h1>
                        £<input ref={this.paymentAmountRef} defaultValue={this.state.paymentAmount}/>
                        
                        <button className="Twilio-Button Twilio-TaskCanvasHeader-EndButton css-gm15qx" onClick={this.initiateAAP}>Request Payment</button>
                    </div>
                </>
            );            
        }

        return (
            <div>
                { this.renderAutoScreenPop() }
                {
                    paymentState != null && (
                        <>
                            <pre>{ JSON.stringify(paymentState, undefined, 2) }</pre>

                            { this.state.paymentMethod == 'credit-card' && 
                                (
                                    <div style={{padding:'5px'}}>
                                    <h1 className="Twilio Twilio-TaskCanvasHeader css-cx2jmb">Credit Card Payment</h1>
                                        
                                        { (paymentState.Result === undefined || paymentState.Result != 'success') && (
                                            <>
                                            { this.renderInput("Payment Card Number", "PaymentCardNumber", "payment-card-number") }
                                            { this.renderInput("Expiration Date", "ExpirationDate", "expiration-date") }
                                            { this.renderInput("Security Code", "SecurityCode", "security-code") }

                                            { paymentState.Required !== undefined && 
                                                <button 
                                                    disabled={paymentState.Required !== ""} 
                                                    className="btn btn-sm btn-primary lift" 
                                                    type="button" 
                                                    onClick={() => this.processPayment()}>Process Payment</button>
                                            }
                                            </>
                                        )}

{
                                          paymentState.Result != undefined && paymentState.Result == 'success' &&
                                                <div className="card">
                                                        <div className="card-body">
                                                        <div className="row">
                                                            <div className="col">
                                                                <label>Confirmation Code</label>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col">
                                                                <div className="form-group">
                                                                    <input type="text" className="form-control" readonly="readonly" defaultValue={ paymentState.PaymentConfirmationCode } />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        }
                                        
                                    </div>
                                )
                            }



                        </>
                    )
                }
                </div>);
    };
}
export default withTaskContext(PaymentAgentView);
