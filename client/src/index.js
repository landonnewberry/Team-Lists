import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Root } from './components/Root';
import { Document } from './components/Document';
import { configureStore } from './configureStore';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

const store = configureStore();

ReactDOM.render(
    <Provider store={ store }>
        <Router>
            <Switch>
                <Route exact path="/" component={ Root } />
                <Route path="/list/:id" component={ Document } />
                <Route component={ Root } />
            </Switch>
        </Router>
    </Provider>, 
    document.getElementById('root')
);

serviceWorker.unregister();
