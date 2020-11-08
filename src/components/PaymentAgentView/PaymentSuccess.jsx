import React from "react";
import {GetSymbolForCurrencyISO} from "../../util/CurrencyUtil";


export default class PaymentSuccess extends React.Component {
    
    render() {
        return (
            <div class="input-card centered-text">
                <div class="payment-checkmark"></div>
                <h1 class="payment-form-heading">Payment Complete</h1>
                <hr class="payment-card-divider" />
                <p>
                    <strong>Amount:</strong> {GetSymbolForCurrencyISO(this.props.currency)}{" "}
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
