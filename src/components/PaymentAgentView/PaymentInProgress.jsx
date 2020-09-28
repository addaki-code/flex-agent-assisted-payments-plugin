import React from 'react';
import PaymentElement from './PaymentElement';

class PaymentInProgress extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        if(!(this.props.paymentState.Result === undefined || this.props.paymentState.Result != 'success')){
            return null;
        }

        return <>
            <div style={{padding:'12px', backgroundColor: 'white', borderBottom:'1px solid rgb(198, 202, 215)', borderLeft:'1px solid rgb(198, 202, 215)'}}>
                <h1 class="Twilio">Capturing Credit Card Information</h1>
                <h2 class="Twilio">Currently Capturing: </h2>
                <p>{this.props.captureField}</p>
                <hr />
                <PaymentElement captureField={this.props.captureField} requestCapture={this.props.requestCapture} paymentState={this.props.paymentState} friendlyName="Payment Card Number" pascalCaseName="PaymentCardNumber" riverCaseName="payment-card-number" />
                <br />
                <PaymentElement captureField={this.props.captureField} requestCapture={this.props.requestCapture} paymentState={this.props.paymentState} friendlyName="Expiration Date" pascalCaseName="ExpirationDate" riverCaseName="expiration-date" />
                <br />
                <PaymentElement captureField={this.props.captureField} requestCapture={this.props.requestCapture} paymentState={this.props.paymentState} friendlyName="Security Code" pascalCaseName="SecurityCode" riverCaseName="security-code" />
                
                {/*
                <br />
                <PaymentElement captureField={this.props.captureField} requestCapture={this.props.requestCapture} paymentState={this.props.paymentState} friendlyName="Postal Code" pascalCaseName="PaymentCardPostalCode" riverCaseName="postal-code" />
                
                */}
                
                <hr />
{/*                 
                <PaymentElement captureField={this.props.captureField} requestCapture={this.props.requestCapture} paymentState={this.props.paymentState} friendlyName="Bank Routing Number" pascalCaseName="BankRoutingNumber" riverCaseName="bank-routing-number" />
                <PaymentElement captureField={this.props.captureField} requestCapture={this.props.requestCapture} paymentState={this.props.paymentState} friendlyName="Bank Account Number" pascalCaseName="BankAccountNumber" riverCaseName="bank-account-number" /> */}



                <>
                {
                    this.props.paymentState.ErrorType !== undefined && this.props.paymentState.ErrorType !== "" && 
                    <div style={{color:'red',fontWeight:'bold'}}>Error: {this.props.paymentState.ErrorType }</div>
                }
                { this.props.paymentState.Required !== undefined && 
                    <button 
                        disabled={this.props.paymentState.Required !== ""} 
                        type="button" 
                        onClick={() => this.props.processPayment()}>Process Payment</button>
                }
                </>

            </div>

            
        </>
    }
}

export default PaymentInProgress;