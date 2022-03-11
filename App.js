import React from 'react';
import {
  StatusBar, Platform
} from 'react-native';
import { Provider } from 'react-redux';
import store from './src/store/store';
import { Main } from './src/components/main/main';
import { changeNavBarColor } from './src/slices/async_thuks';

const App = () => {
  let androidStatusBar = null;
  StatusBar.setBarStyle('light-content', true);
  if (Platform.OS === 'android') {
    changeNavBarColor();
    androidStatusBar = (
      <StatusBar
        backgroundColor="#681A0B"
        barStyle="light-content"
      />
    );
  }
  return (
    <Provider store={ store }>
      { androidStatusBar }
      <Main />
    </Provider>
  );
};

export default App;
