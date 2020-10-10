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
import PostViewer from "./think_bank/PostViewer";
import Alert from "./components/Alert";
import UserBank from "./think_bank/UserBank";
import Bot from "./think_bank/Bot";
class App extends Component {

  render() {
    const { persistor, store } = configureStore()

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <UserMenu />
            <Alert />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/service-list" component={ServiceList} />
              <Route exact path="/think-bank" component={Workspace_TB} />
              <Route
                exact path="/post/:user/:id"
                render={(props) => <PostViewer {...props} />} />
              <Route
                exact path="/userbank/:user/"
                render={(props) => <UserBank {...props} />} />

            </Switch>
          </Router>
        </PersistGate>
      </Provider>
    )
  }
}
export default App
