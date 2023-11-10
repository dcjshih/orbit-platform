import React, { Component } from 'react';
import { Link, NavLink, Redirect } from 'react-router-dom';
import { Authenticated } from '../AccessControl';
import Icon from '../Icon';
import './Navbar.sass';
import logo from '../../images/orbit_logo_small.png';

class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      explore: false,
      myOrbit: false,
      redirect: false,
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.closeDropdowns = this.closeDropdowns.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillUnmount() {
    this.closeDropdowns();
  }

  closeDropdowns() {
    this.setState({
      explore: false,
      myOrbit: false,
    });
    document.removeEventListener('click', this.closeDropdowns);
  }

  toggleDropdown(name) {
    if (this.state[name]) {
      this.setState({ [name]: false });
      document.removeEventListener('click', this.closeDropdowns);
    } else {
      this.setState({ [name]: true });
      document.addEventListener('click', this.closeDropdowns);
    }
  }

  logout() {
    localStorage.clear();
    this.setState({ redirect: true });
  }

  render() {
    const { explore, myOrbit, redirect } = this.state;
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    // destination when pressing the logo
    const home = (id && token) ? '/ideas' : '/login';

    if (redirect === true) {
      return <Redirect to="/login" />;
    }
    return (
      <nav className="navigation">
        <div className="navigation-wrapper">
          <Link to={home} className="navigation-brand">
            <img src={logo} alt="ORBIT" />
          </Link>

          <Authenticated>

            <ul className="navigation-primary">
              <li className="navigation-item dropdown">
                <button
                  type="button"
                  className="dropdown-toggle"
                  onClick={() => this.toggleDropdown('explore')}
                >
                  Explore
                </button>
                { explore === true && (
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink to="/ideas">Ideas</NavLink>
                    </li>
                    <li>
                      <NavLink to="/people">People</NavLink>
                    </li>
                  </ul>
                )}

              </li>
              <li className="navigation-item dropdown">
                <button
                  type="button"
                  className="dropdown-toggle"
                  onClick={() => this.toggleDropdown('myOrbit')}
                >
                  My Orbit
                </button>
                { myOrbit === true && (
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink to="/ideas/mine">My ideas</NavLink>
                    </li>
                    <li>
                      <NavLink to="/ideas/new">Create idea</NavLink>
                    </li>
                    <li>
                      <NavLink to="/people/me/bookmarks">My bookmarks</NavLink>
                    </li>
                  </ul>
                )}
              </li>
            </ul>

            <ul className="navigation-secondary">
              <li className="navigation-item">
                <Link to="/people/me">
                  <Icon type="account-circle" />
                  <span className="navigation-icon-label">Profile</span>
                </Link>
              </li>
              <li className="navigation-item">
                <button type="button" onClick={this.logout}>
                  Logout
                </button>
              </li>
            </ul>
          </Authenticated>
        </div>
      </nav>
    );
  }
}

export default Navbar;
