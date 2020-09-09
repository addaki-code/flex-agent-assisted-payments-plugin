import React from "react";

export default class PaymentSuccess extends React.Component {
    render() {
        return (
            <div
                class="input-card"
                style={{
                    "text-align": "center",
                }}
            >
                <div class="payment-checkmark"></div>
                <h1 class="payment-form-heading">Payment Complete</h1>
                <hr class="payment-card-divider" />
                <p>
                    <strong>Amount:</strong> {this.props.ChargeAmount}
                </p>
                <p>
                    <strong>Confirmation Code:</strong>{" "}
                    {this.props.Confirmation}
                </p>
            </div>
        );
    }
}
