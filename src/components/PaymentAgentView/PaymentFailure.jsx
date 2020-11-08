import React from "react";

export default class PaymentFailure extends React.Component {
    
    render() {
        let currency = "$";
        if (this.props.currency === "gbp") {
            currency = "£";
        }

        return (
            <div
                className="input-card"
                style={{
                    "textAlign": "center",
                }}
            >
                <div className="payment-errormark"></div>
                <h1 className="payment-form-heading">Payment Failed!</h1>
                <hr className="payment-card-divider" />
                <p>
                    <strong>Amount:</strong> {currency}{" "}
                    {this.props.chargeAmount}
                </p>
                <p>
                    <strong>Payment Result:</strong>{" "}
                    {this.props.paymentState.Result}
                </p>
                <p>
                    <strong>Payment Error:</strong>{" "}
                    {this.props.paymentState.PaymentError}
                </p>
                <p>
                    <strong>Connector Error:</strong>{" "}
                    {this.props.paymentState.ConnectorError}
                </p>
            </div>
        );
    }
}
