// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);

/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React from 'react';
import {Provider} from 'react-redux';
import {Store} from './src/redux/Store';
import {PaperProvider} from 'react-native-paper';

const ReduxApp = () => (
  <Provider store={Store}>
    <PaperProvider>
      <App />
    </PaperProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
