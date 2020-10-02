import React, { Component } from "react";
import { render } from "react-dom";

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Workspace_TB from "./think_bank/Workspace_TB";
import Home from "./components/Home";

import { Provider } from 'react-redux';
import { configureStore } from './store';
import ServiceList from "./components/ServiceList";
import { PersistGate } from "redux-persist/integration/react";
import UserMenu from "./components/UserMenu";
class App extends Component {

  render() {
    const { persistor, store } = configureStore()

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <UserMenu />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/service-list" component={ServiceList} />
              <Route exact path="/think-bank" component={Workspace_TB} />
            </Switch>
          </Router>
        </PersistGate>
      </Provider>
    )
  }
}
export default App
