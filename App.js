/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useEffect} from 'react';
import Router from './src/Router';
import {Provider} from 'react-redux';
import {NativeBaseProvider} from 'native-base';
import reducers from './src/reducers/index';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';

const App: () => React$Node = () => {
  const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <Router />
      </NativeBaseProvider>
    </Provider>
  );
};
export default App;
