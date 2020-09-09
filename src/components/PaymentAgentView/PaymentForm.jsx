import React from "react";
import PaymentIntro from "./PaymentIntro";

class PaymentForm extends React.Component {
    constructor(props) {
        super(props);

        this.paymentAmountRef = React.createRef();
        this.paymentCurrencyRef = React.createRef();

        this.state = {
            showLoadingSpinner: false,
        };
    }

    initiateAAP = () => {
        this.props.initiateAAP(
            this.paymentCurrencyRef.current.value,
            this.paymentAmountRef.current.value
        );
    };

    render() {
        return (
            <div class="input-card">
                <div class="pay-icon"></div>
                <h1 class="payment-form-heading">Checkout with Twilio Pay</h1>

                <div
                    style={{
                        display: "flex",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            "flex-direction": "column",
                            padding: "15px",
                            "padding-left": "0px",
                        }}
                    >
                        <h2 class="form-label">Currency</h2>
                        <select
                            class="payment-form-select"
                            ref={this.paymentCurrencyRef}
                        >
                            <option value="usd">USD ($)</option>
                            <option value="gbp">GBP (£)</option>
                        </select>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            "flex-direction": "column",
                            padding: "15px",
                        }}
                    >
                        <h2 class="form-label">Charge Amount</h2>
                        <input
                            ref={this.paymentAmountRef}
                            class="payment-form-input"
                            defaultValue="10.00"
                        />
                    </div>
                </div>
                <br></br>
                <button
                    className="Twilio-Button Twilio-TaskCanvasHeader-EndButton payment-form-button"
                    onClick={this.initiateAAP}
                >
                    Request payment
                </button>
            </div>
        );
    }
}

export default PaymentForm;
