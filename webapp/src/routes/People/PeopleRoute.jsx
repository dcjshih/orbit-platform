import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Index from './PersonIndex';
import Edit from './PersonEdit';
import Bookmarks from './PersonBookmarks';
import Person from './Person';

function PeopleRoute(props) {
  const { match } = props;
  const subpath = (path) => match.path + path;
  return (
    <Switch>
      <Route path={subpath('/me/edit')} component={Edit} />
      <Route path={subpath('/me/bookmarks')} component={Bookmarks} />
      <Route path={subpath('/me')} component={Person} />
      <Route path={subpath('/:personId')} component={Person} />
      <Route exact path={subpath('/')} component={Index} />
    </Switch>
  );
}

export default PeopleRoute;
