import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import FormField from '../FormField';
import TextInput from '../TextInput';
import Button from '../Button';
import './LoginForm.sass';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      alert: false,
      email: '',
      password: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { email, password } = this.state;
    axios
      .post(`${API_URL}/auth/local`, {
        identifier: email,
        password,
      })
      .then((response) => {
        // Handle successful login
        localStorage.setItem('token', response.data.jwt);
        localStorage.setItem('id', response.data.user.id);
        this.setState({ authenticated: true });
      })
      .catch((error) => {
        // Handle failed login
        this.setState({ alert: true });
      });
  }

  render() {
    const {
      authenticated,
      alert,
      email,
      password,
    } = this.state;

    // Redirect upon successful authentication
    if (authenticated) {
      return <Redirect to="/ideas" />;
    }

    // Render login form
    return (
      <form className="login-form" onSubmit={this.handleSubmit}>

        <FormField label="Email:">
          <TextInput
            name="email"
            type="email"
            value={email}
            placeholder="Name@domain.com"
            onChange={this.handleInputChange}
            required
          />
        </FormField>

        <FormField label="Password:">
          <TextInput
            name="password"
            type="password"
            value={password}
            placeholder="Password"
            onChange={this.handleInputChange}
            required
          />
        </FormField>

        <Button label="Login" />
        { alert && <div className="alert">Invalid username or password.</div> }
      </form>
    );
  }
}

export default LoginForm;
