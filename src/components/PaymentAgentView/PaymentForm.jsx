import React from "react";
import config from '../../payConfig.json'


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

        const currencies = [];
        config.CURRENCY_CONFIG.forEach((currency, index) => {
            currencies.push(
                <option 
                    value={currency.ISO}>
                    {currency.ISO.toUpperCase()} ({currency.Symbol})
                </option>
            )
        })

        return (
            <div className="input-card">
                <div className="pay-icon"></div>
                <h1 className="payment-form-heading">Checkout with Twilio Pay</h1>

                <div className="payment-form">
                    <div className="payment-form-group">
                        <h2 className="form-label">Currency</h2>
                        <select
                            className="payment-form-select"
                            ref={this.paymentCurrencyRef}
                        >
                            {currencies}
                        </select>
                    </div>
                    <br />
                    <div className="payment-form-group">
                        <h2 className="form-label">Charge Amount</h2>
                        <input
                            ref={this.paymentAmountRef}
                            className="payment-form-input"
                            defaultValue="10.00"
                        />
                    </div>
                    <br /> 
                    <div className="payment-form-group">
                        <h2 className="form-label">Charge Description</h2>
                        <input
                            ref={this.paymentDescriptionRef}
                            className="payment-form-input"
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
