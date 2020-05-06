import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin, loadCSS } from 'flex-plugin';

import PaymentAgentView from './components/PaymentAgentView/PaymentAgentView';
import reducers, { namespace } from './states';

const PLUGIN_NAME = 'PayPlugin';

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

    loadCSS("https://lava-guanaco-9004.twil.io/assets/theme.min.css");
    

    const options = { sortOrder: -1 };
    flex.AgentDesktopView
      .Panel2
      .Content
      .replace(<PaymentAgentView key="payment-component" />, options);

    
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
