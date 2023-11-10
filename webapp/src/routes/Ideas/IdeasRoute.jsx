import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Index from './IdeaIndex';
import New from './IdeaNew';
import Mine from './IdeasMine';
import Edit from './IdeaEdit';
import Idea from './Idea';

function IdeasRoute(props) {
  const { match } = props;
  const subpath = (path) => match.path + path;
  return (
    <Switch>
      <Route path={subpath('/new')} component={New} />
      <Route path={subpath('/mine')} component={Mine} />
      <Route path={subpath('/:ideaId/edit')} component={Edit} />
      <Route path={subpath('/:ideaId')} component={Idea} />
      <Route exact path={subpath('/')} component={Index} />
    </Switch>
  );
}

export default IdeasRoute;
