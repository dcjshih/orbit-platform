import React, { Component, Fragment } from 'react';
import axios from 'axios';

import FormField from '../../components/FormField';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import logo from '../../images/orbit_logo_small.png';
import './PasswordForgotten.sass';

class PasswordForgotten extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      notification: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { email } = this.state;
    if (email) {
      axios
        .post(`${API_URL}/auth/forgot-password`,
          { email })
        .then((response) => {
          this.setState({ notification: 'We have sent you an email with a link to reset your password.' });
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
    const { email, notification } = this.state;
    return (
      <Fragment>
        <section className="wrapper">
          <div className="login-wrapper">
            <div className="login-description">

              <div className="branding">
                <img src={logo} alt="ORBIT" />
              </div>
              <form className="password-forgotten" onSubmit={this.handleSubmit}>
                <h2>Forgotten Password</h2>
                <p className="password-forgotten-description">Provide your email address below and we will send you a secure reset password link.</p>

                <FormField label="Email:" required>
                  <TextInput
                    name="email"
                    type="email"
                    value={email}
                    placeholder="account@domain.com"
                    onChange={this.handleInputChange}
                    required
                  />
                </FormField>

                <Button label="Reset Password" />
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

export default PasswordForgotten;
