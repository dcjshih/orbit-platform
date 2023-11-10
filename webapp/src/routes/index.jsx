import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

// Load Routes
import Ideas from './Ideas';
import People from './People';
import Login from './Login';
import Register from './Register';
import Password from './Password';

class Routes extends Component {
  constructor() {
    super();
    const token = localStorage.getItem('token');
    this.state = { authenticated: !!token };
  }

  render() {
    const { authenticated } = this.state;
    return (
      <Switch>
        <Route exact path="/" component={authenticated ? Ideas : Login} />
        <Route path="/ideas" component={Ideas} />
        <Route path="/people" component={People} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/password" component={Password} />
      </Switch>
    );
  }
}

export default Routes;
