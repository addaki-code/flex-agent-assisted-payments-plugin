import React from "react";

class PaymentElement extends React.Component {
    constructor(props) {
        super(props);
    }

    getStyle = () => {
        if (
            this.props.paymentState[this.props.pascalCaseName] !== undefined &&
            this.props.paymentState[this.props.pascalCaseName] !== ""
        ) {
            return {
                "background-color": "#3bb78f",
                "background-image":
                    "linear-gradient(315deg, rgb(59, 183, 143) 0%, rgb(136 218 182) 74%)",
            };
        }
        if (this.props.captureField === this.props.riverCaseName) {
            return {
                "background-color": "#fec84e",
                "background-image":
                    "linear-gradient(315deg, #fec84e 0%, #ffdea8 74%)",
            };
        } else {
            return {
                "background-color": "#e7eff9",
                "background-image":
                    "linear-gradient(315deg, #e7eff9 0%, #cfd6e6 74%)",
            };
        }
    };

    render() {
        return (
            <div style={this.getStyle()} class="payment-input-container">
                <h2 class="form-label">{this.props.friendlyName}</h2>
                <input
                    ref={this.paymentAmountRef}
                    value={this.props.paymentState[this.props.pascalCaseName]}
                />

                <button
                    className="Twilio-Button Twilio-TaskCanvasHeader-EndButton payment-form-button"
                    type="button"
                    onClick={() =>
                        this.props.requestCapture(this.props.riverCaseName)
                    }
                >
                    Request {this.props.friendlyName}
                </button>

                <div class="circle-loader">
                    <div class="checkmark draw"></div>
                </div>
            </div>
        );
    }
}

export default PaymentElement;
