import React from "react";
import {GetSymbolForCurrencyISO} from "../../util/CurrencyUtil";


export default class PaymentFailure extends React.Component {
    
    render() {
        return (
            <div className="input-card centered-text">
                <div className="payment-errormark"></div>
                <h1 className="payment-form-heading">Payment Failed!</h1>
                <hr className="payment-card-divider" />
                <p>
                    <strong>Amount:</strong> {GetSymbolForCurrencyISO(this.props.currency)}{" "}
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
