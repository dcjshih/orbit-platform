import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import './styles/main.sass';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: false,
    };
  }

  setToken(token) {
    this.setState({
      token,
    });
  }

  render() {
    const { token } = this.state;
    return (
      <BrowserRouter>
        <Routes authenticated={!!token} />
      </BrowserRouter>
    );
  }
}

export default App;
