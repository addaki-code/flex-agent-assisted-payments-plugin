import React from 'react';

class PaymentElement extends React.Component {

    constructor(props) {
        super(props);
    }

    getStyle = () => {
        if(this.props.paymentState[this.props.pascalCaseName] !== undefined && 
            this.props.paymentState[this.props.pascalCaseName] !== ""){
            return { backgroundColor: 'rgb(234,255,234)', border:'1px solid green' }
        }
        if(this.props.captureField === this.props.riverCaseName) {
            return { backgroundColor: 'rgb(255,255,234)', border:'1px solid orange' }
        }else{
            return { backgroundColor:'rgb(234,234,234)' , border:'1px solid gray'}
        }
    }

    render() {
        return (
            <div style={this.getStyle()}>
                <h2 className='Twilio'>{this.props.friendlyName}</h2>
                <p>{ this.props.paymentState[this.props.pascalCaseName] }</p>
                
                <button 
                    type="button" 
                    disabled={this.props.captureField === this.props.riverCaseName}
                    onClick={() => this.props.requestCapture(this.props.riverCaseName)}
                    >Request Capture</button> 
            </div>
        );
    }
}

export default PaymentElement;