import React from "react";

export default class PaymentIntro extends React.Component {
    render() {
        return null;
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
                        class="payment-intro-heading"
                        style={{ "line-height": "80%" }}
                    >
                        Twilio Flex
                    </h1>
                    <h1
                        class="payment-intro-heading"
                        style={{ "line-height": "125%" }}
                    >
                        Agent Assisted &lt;Pay&gt;
                    </h1>
                    <br></br>
                    <h2 class="payment-intro-subhead">
                        Provide a seamless and secure transaction with
                        agent-assisted payments in Twilio Flex.
                    </h2>
                </div>
            </div>
        );
    }
}
