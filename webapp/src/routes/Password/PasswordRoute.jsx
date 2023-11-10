import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Forgotten from './PasswordForgotten';
import Reset from './PasswordReset';

function PasswordRoute(props) {
  const { match } = props;
  const subpath = (path) => match.path + path;
  return (
    <Switch>
      <Route path={subpath('/forgotten')} component={Forgotten} />
      <Route path={subpath('/reset')} component={Reset} />
    </Switch>
  );
}

export default PasswordRoute;
