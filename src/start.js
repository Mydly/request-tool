/**
 * Created by Administrator on 2017/4/12.
 */
;
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { HashRouter as Router, Route} from 'react-router-dom'
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import Routes from './main/routes'
import reducers from  './reducers/index';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var store = createStore(reducers,applyMiddleware(thunk, logger));


ReactDOM.render(

    <MuiThemeProvider>
        <Provider store={store}>
                <Routes />
        </Provider>
        </MuiThemeProvider>
    ,document.getElementById('app'));

