import React from "react";
import PaymentElement from "./PaymentElement";

class PaymentInProgress extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (
            !(
                this.props.paymentState.Result === undefined ||
                this.props.paymentState.Result != "success"
            )
        ) {
            return null;
        }

        return (
            <>
                <div class="input-card">
                    <h1 class="payment-intro-heading">
                        Capture Credit Card Information
                    </h1>
                    <hr />
                    <PaymentElement
                        captureField={this.props.captureField}
                        requestCapture={this.props.requestCapture}
                        paymentState={this.props.paymentState}
                        friendlyName="Payment Card Number"
                        pascalCaseName="PaymentCardNumber"
                        riverCaseName="payment-card-number"
                    />
                    <PaymentElement
                        captureField={this.props.captureField}
                        requestCapture={this.props.requestCapture}
                        paymentState={this.props.paymentState}
                        friendlyName="Expiration Date"
                        pascalCaseName="ExpirationDate"
                        riverCaseName="expiration-date"
                    />
                    <PaymentElement
                        captureField={this.props.captureField}
                        requestCapture={this.props.requestCapture}
                        paymentState={this.props.paymentState}
                        friendlyName="Security Code"
                        pascalCaseName="SecurityCode"
                        riverCaseName="security-code"
                    />
                    <>
                        {this.props.paymentState.ErrorType !== undefined &&
                            this.props.paymentState.ErrorType !== "" && (
                                <div
                                    style={{ color: "red", fontWeight: "bold" }}
                                >
                                    Error: {this.props.paymentState.ErrorType}
                                </div>
                            )}
                        {this.props.paymentState.Required !== undefined && (
                            <button
                                style={{
                                    width: "100%",
                                    "border-radius": "7px",
                                    "box-shadow":
                                        "0px 3px 3px 0px rgb(134 134 134 / 25%)",
                                }}
                                className="Twilio-Button Twilio-TaskCanvasHeader-EndButton css-gm15qx"
                                disabled={
                                    this.props.paymentState.Required !== ""
                                }
                                type="button"
                                onClick={() => this.props.processPayment()}
                            >
                                Process Payment
                            </button>
                        )}
                    </>
                </div>
            </>
        );
    }
}

export default PaymentInProgress;
