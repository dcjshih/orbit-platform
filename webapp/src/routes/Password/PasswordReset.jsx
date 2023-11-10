import React, { Component, Fragment } from 'react';
import axios from 'axios';

import FormField from '../../components/FormField';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import logo from '../../images/orbit_logo_small.png';
import './PasswordReset.sass';

class PasswordReset extends Component {
  constructor(props) {
    super(props);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');

    this.state = {
      code: code || '',
      password: '',
      passwordConfirmation: '',
      notification: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { code, password, passwordConfirmation } = this.state;

    if (password !== passwordConfirmation) {
      this.setState({
        notification: 'The two passwords do not match',
      });
    } else {
      axios
        .post(`${API_URL}/auth/reset-password`,
          {
            code,
            password,
            passwordConfirmation,
          })
        .then((response) => {
          localStorage.setItem('token', response.data.jwt);
          localStorage.setItem('id', response.data.user.id);
          this.props.history.push('/ideas');
        })
        .catch((error) => {
          this.setState({ notification: 'An error occurred.' });
        });
    }
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  }

  render() {
    const {
      code,
      password,
      passwordConfirmation,
      notification,
    } = this.state;

    return (
      <Fragment>
        <section className="wrapper">
          <div className="login-wrapper">
            <div className="login-description">

              <div className="branding">
                <img src={logo} alt="ORBIT" />
              </div>

              <form className="password-reset" onSubmit={this.handleSubmit}>
                <h2>Create a new password</h2>
                <FormField label="Security code" required>
                  <TextInput
                    name="code"
                    type="text"
                    placeholder="Press link in email to populate"
                    value={code}
                    onChange={this.handleInputChange}
                  />
                </FormField>

                <FormField label="Password" required>
                  <TextInput
                    name="password"
                    type="password"
                    value={password}
                    onChange={this.handleInputChange}
                  />
                </FormField>

                <FormField label="Confirm password" required>
                  <TextInput
                    name="passwordConfirmation"
                    type="password"
                    value={passwordConfirmation}
                    onChange={this.handleInputChange}
                  />
                </FormField>
                <p className="content-area form-field-descriptor">Passwords must be at least 8 characters and contain at least one number, uppercase letter, and lowercase letter.</p>

                <Button label="Create New Password" />
              </form>
              { notification && <p>{ notification }</p> }

            </div>
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}

export default PasswordReset;
