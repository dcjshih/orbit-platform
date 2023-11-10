import React, { Component, Fragment } from 'react';

class Authenticated extends Component {
  constructor() {
    super();
    const token = localStorage.getItem('token');
    this.state = { authenticated: !!token };
  }

  render() {
    const { authenticated } = this.state;
    const { children } = this.props;

    return (
      <Fragment>
        {authenticated && children}
      </Fragment>
    );
  }
}

export { Authenticated };
