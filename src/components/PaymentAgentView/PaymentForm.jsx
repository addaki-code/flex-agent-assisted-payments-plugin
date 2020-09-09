import React from "react";

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
        if (!this.props.isDisplayed && this.props.paymentState === null) {
            return (
                <div>
                    <div class="credit-card-container">
                        <div class="credit-card-body">
                            <div class="logo"></div>
                            <div class="number"></div>
                            <div class="name"></div>
                            <div class="chip"></div>
                        </div>
                    </div>
                    <div class="payment-intro-text">
                        <h1
                            style={{ "line-height": "80%" }}
                            class="payment-intro-heading"
                        >
                            Twilio Flex
                        </h1>
                        <h1
                            class="payment-intro-heading"
                            style={{ "line-height": "125%" }}
                        >
                            Payments
                        </h1>
                        <br></br>
                        <p
                            style={{
                                "word-break": "break-word",
                                width: "400px",
                                margin: "0 auto",
                                "font-weight": 100,
                                "font-size": "27px",
                                "line-height": "110%",
                            }}
                        >
                            Provide a seamless and secure transaction with
                            agent-assisted payments in Twilio Flex.
                        </p>
                    </div>
                </div>
            );
        } else if (this.props.paymentState === null) {
            return (
                <div class="input-card">
                    <div class="pay-icon"></div>
                    <h1 class="payment-form-heading">
                        Checkout with Twilio Pay
                    </h1>

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
        } else {
            return null;
        }
    }
}

export default PaymentForm;
