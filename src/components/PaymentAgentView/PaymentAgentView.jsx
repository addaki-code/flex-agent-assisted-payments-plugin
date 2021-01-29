import React from "react";
import { withTaskContext, Tab } from "@twilio/flex-ui";
import { SyncClient } from "twilio-sync";
import PaymentForm from "./PaymentForm";
import PaymentInProgress from "./PaymentInProgress";
import PaymentSuccess from "./PaymentSuccess";
import PaymentFailure from "./PaymentFailure";
import { GetTokenisedFetchOptions } from "../../util/FlexUtil"
import { PayCaptureParameter, PayCompleteSession, PayInitiateRequest } from "./PayRequestFactory"

// It is recommended to keep components stateless and use redux for managing states
class PaymentAgentView extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            runtimeUrl: props.runtimeUrl,
            paymentSid: null,
            aapStatus: [],
            captureField: undefined,
            paymentMethod: "credit-card",
            isDisplayed: false
        };

        this.idempotencyKey = 1;

        window.Twilio.Flex.Actions.addListener(
            "afterAcceptTask", 
            (payload) => { this.resetPay(); }
        );

        window.Twilio.Flex.Actions.addListener(
            "afterCompleteTask",
            (payload) => { this.resetPay(); }
        );

        window.Twilio.Flex.CallCanvasActions.Content.add(
            <button
                onClick={this.displayPaymentForm}
                className="Twilio-IconButton Twilio-CallCanvas-Dialpad css-w77p7x"
                key="pay-btn"
            >
                PAY
            </button>,
            { sortOrder: -1 }
        );
    }

    resetPay = () => {
        this.setState({
            paymentSid: null,
            aapStatus: [],
            captureField: undefined,
            paymentMethod: "credit-card",
            isDisplayed: false,
            showPaymentForm: false,
        });
    }

    displayPaymentForm = () => {
        this.setState({ showPaymentForm: true });
    };

    addEventToState = (newItem) => {
        this.setState({ aapStatus: [...this.state.aapStatus, newItem] });
    };

    subscribeToSync = (token) => {
        console.log(
            "Subscribing to Sync list for aap:" +
                this.props.task.attributes.call_sid
        );
        var sync = new SyncClient(token);
        sync.list("aap:" + this.props.task.attributes.call_sid)
            .then((list) => {
                console.log("Successfully opened a List. SID: " + list.sid);

                list.getItems({ from: 0, order: "asc" })
                    .then((paginator) => {
                        console.log(paginator);
                        paginator.items.forEach((item) => {
                            console.log(item);
                            this.addEventToState(item.data.value);
                        });
                    })
                    .catch(function (error) {
                        console.error("List getItems() failed", error);
                    });

                list.on("itemAdded", (event) => {
                    console.log("Received itemAdded event: ", event);
                    this.addEventToState(event.item.data.value);
                });
            })
            .then((subscribed) => {
                this.requestCapture("payment-card-number");
            })
            .catch(function (error) {
                console.log("Unexpected error", error);
            });
    };

        

    showPaymentForm = () => {
        this.setState({ showPaymentForm: true });
    };

    initiateAAP = (currency, chargeAmount, paymentMethod, description) => {
        console.log(this.props.task.attributes);

        this.setState({
            ChargeAmount: chargeAmount,
            Currency: currency,
            aapStatus: [{ step: "initiating" }],
        });

        console.log(
            "Initiating Payment for Call Sid: " +
                this.props.task.attributes.conference.participants.customer
        );

        fetch(this.state.runtimeUrl + "/sync-token", GetTokenisedFetchOptions({}))
            .then((token) => {
                token.json().then((json) => {
                    // Now post to Begin Session
                    var body = {
                        CallSid: this.props.task.attributes.conference.participants.customer,
                        ChargeAmount: chargeAmount,
                        Currency: currency,
                        IdempotencyKey: ++this.idempotencyKey,
                        Description: description,
                        PaymentMethod: paymentMethod
                    };
                    console.table(body);
            
                    fetch(PayInitiateRequest(body))
                        .then((success) => {
                            console.log("Initiated AAP");
                            success.json().then((response) => {
                                console.log(response);
                                this.setState({
                                    paymentSid: response.sid,
                                    isDisplayed: true,
                                    showPaymentForm: false,
                                });
                                this.subscribeToSync(json.token);
                            });
                        })
                        .catch((err) => {
                            console.error("Failed to initiate AAP");
                        });
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    requestCapture = (captureField) => {
        var body = {
            CallSid: this.props.task.attributes.call_sid,
            ConfSid: this.props.task.attributes.conference.sid,
            PaymentSid: this.state.paymentSid,
            Capture: captureField,
            IdempotencyKey: ++this.idempotencyKey,
        };

        console.log("Requesting capture of field: " + captureField);

        fetch(PayCaptureParameter(body))
            .then((success) => {
                this.setState({ captureField: captureField });
            })
            .catch((err) => {
                console.log("Failed to request element");
                console.log(err);
            });
    };

    processPayment = () => {
        console.log("attempting to process payment via Pay Connector");

        var body = {
            CallSid: this.props.task.attributes.call_sid,
            PaymentSid: this.state.paymentSid,
            Status: "complete",
            IdempotencyKey: ++this.idempotencyKey,
        };

        fetch(PayCompleteSession(body))
            .then((success) => {
                console.log("Payment completion requested");
            })
            .catch((err) => {
                console.log("Failed to request payment completion", err);
            });
    };

    latestPaymentState = () => {
        if (this.state.aapStatus.length === 0) return null;
        return this.state.aapStatus[this.state.aapStatus.length - 1];
    };

    render() {
        const { task } = this.props;

        var paymentState = this.latestPaymentState();
        let pageContent;
        if (
            (this.state.showPaymentForm === undefined ||
                this.state.showPaymentForm === false) &&
            paymentState === null
        ) {
            return null;
        } else if (
            this.state.showPaymentForm === true &&
            this.latestPaymentState() === null
        ) {
            pageContent = (
                <PaymentForm
                    isDisplayed={this.state.showPaymentForm}
                    initiateAAP={this.initiateAAP}
                    paymentState={paymentState}
                />
            );
        } else if (
            paymentState !== null &&
            paymentState.Result === undefined &&
            this.state.paymentMethod === "credit-card"
        ) {
            pageContent = (
                <PaymentInProgress
                    captureField={this.state.captureField}
                    paymentState={paymentState}
                    requestCapture={this.requestCapture}
                    processPayment={this.processPayment}
                    chargeAmount={this.state.ChargeAmount}
                    currency={this.state.Currency}
                />
            );
        } else if (
            paymentState.Result != undefined &&
            paymentState.Result == "success"
        ) {
            pageContent = (
                <PaymentSuccess
                    chargeAmount={this.state.ChargeAmount}
                    currency={this.state.Currency}
                    confirmation={paymentState.PaymentConfirmationCode}
                />
            );
        } else if (
            paymentState.Result != undefined && 
            paymentState.Result != "success" 
        ) {
            pageContent = (
                <PaymentFailure
                    chargeAmount={this.state.ChargeAmount}
                    currency={this.state.Currency}
                    paymentState={paymentState}
                />
            )
        }

        return (
            <div className="component-container">
                <div className="hero-background"></div>
                {pageContent}
            </div>
        );
    }
}
export default withTaskContext(PaymentAgentView);
