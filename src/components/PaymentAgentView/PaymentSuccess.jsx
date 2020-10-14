import React from "react";

export default class PaymentSuccess extends React.Component {
    render() {
        let currency = "$";
        if (this.props.currency === "gbp") {
            currency = "£";
        }

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
                    <strong>Amount:</strong> {currency}{" "}
                    {this.props.chargeAmount}
                </p>
                <p>
                    <strong>Confirmation Code:</strong>{" "}
                    {this.props.confirmation}
                </p>
            </div>
        );
    }
}
