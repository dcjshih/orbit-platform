import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import './ModalWelcome.sass';

class ModalWelcome extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: true };
    this.close = this.close.bind(this);
  }

  close() {
    this.setState({ visible: false });
  }

  render() {
    const { visible } = this.state;
    if (!visible) return null;

    return (
      <Fragment>
        <div className="modal-background" onClick={this.close} />
        <div className="modal welcome">
          <div className="modal-header">
            <h2>Congratulations!</h2>
            <Link
              className="modal-close"
              onClick={this.close}
              to={{
                pathname: '/ideas',
                search: '',
              }}
            >
              <Icon type="clear" />
            </Link>
          </div>
          <p>Your profile has been published on ORBIT.</p>
          <p>What do you want to do next?</p>

          <ul className="button-group">
            <li>
              <Link to="/people" className="button">Explore People</Link>
            </li>
            <li>
              <Link to="/ideas/new" className="button">Create a new Project Idea</Link>
            </li>
            <li>
              <Link
                className="button"
                onClick={this.close}
                to={{
                  pathname: '/ideas',
                  search: '',
                }}
              >
                Explore Ideas
              </Link>
            </li>
          </ul>
        </div>
      </Fragment>
    );
  }
}

export default ModalWelcome;
