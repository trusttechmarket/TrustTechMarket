import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers/index'

//store 에서 미들웨어로 function과 promise 형식도 받을 수 있도록 reduxThunk, reduxPromise 활용
const creaetStoreWithMiddlewrare = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);

ReactDOM.render(
  <Provider
    store={creaetStoreWithMiddlewrare(Reducer,
      window.__REDUX_DEVTOOLS_EXTENTSION__ &&
      window.__REDUX_DEVTOOLS_EXTENTSION__()
      )}
  >
    <App />
    </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
