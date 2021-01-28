import React from "react";
import { VERSION, Tab } from "@twilio/flex-ui";
import { FlexPlugin, loadCSS } from "flex-plugin";
import './styles/styles.css';
import config from './payConfig.json'

import PaymentAgentView from "./components/PaymentAgentView/PaymentAgentView";

const PLUGIN_NAME = "PayPlugin";


export default class PayPlugin extends FlexPlugin {
    constructor() {
        super(PLUGIN_NAME);
    }

    /**
     * This code is run when your plugin is being started
     * Use this to modify any UI components or attach to the actions framework
     *
     * @param flex { typeof import('@twilio/flex-ui') }
     * @param manager { import('@twilio/flex-ui').Manager }
     */
    init(flex, manager) {
        this.registerReducers(manager);

        //loadCSS("http://localhost:3000/styles.css");

        const options = { sortOrder: -1 };
        flex.AgentDesktopView.Panel2.Content.add(
            <PaymentAgentView key="payment-component" runtimeUrl={config.RUNTIME_URL} />,
            options
        );
    }

    /**
     * Registers the plugin reducers
     *
     * @param manager { Flex.Manager }
     */
    registerReducers(manager) {
        if (!manager.store.addReducer) {
            // eslint: disable-next-line
            console.error(
                `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`
            );
            return;
        }

        //manager.store.addReducer(namespace, reducers);
    }
}
