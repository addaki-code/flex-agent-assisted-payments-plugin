import React from "react";


class PaymentForm extends React.Component {
    constructor(props) {
        super(props);

        this.paymentAmountRef = React.createRef();
        this.paymentCurrencyRef = React.createRef();
        this.paymentMethodRef = React.createRef();
        this.paymentDescriptionRef = React.createRef();

        this.state = {
            showLoadingSpinner: false,
        };
    }

    initiateAAP = () => {
        this.props.initiateAAP(
            this.paymentCurrencyRef.current.value,
            this.paymentAmountRef.current.value,
            "credit-card",
            this.paymentDescriptionRef.current.value
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
                        flexDirection: "row",
                        flexWrap: "wrap"
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
                            <option value="gbp">GBP (£)</option>
                            <option value="usd">USD ($)</option>
                            <option value="eur">EUR (€)</option>
                        </select>
                    </div>
                    <br />
                    <div
                        style={{
                            display: "flex",
                            "flex-direction": "column",
                            padding: "15px",
                            "padding-left": "0px",

                        }}
                    >
                        <h2 class="form-label">Charge Amount</h2>
                        <input
                            ref={this.paymentAmountRef}
                            class="payment-form-input"
                            defaultValue="10.00"
                        />
                    </div>
                    <br /> 
                    <div
                        style={{
                            display: "flex",
                            "flex-direction": "column",
                            padding: "15px",
                            "padding-left": "0px",

                        }}
                    >
                        <h2 class="form-label">Charge Description</h2>
                        <input
                            ref={this.paymentDescriptionRef}
                            class="payment-form-input"
                            placeholder="Description"
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
