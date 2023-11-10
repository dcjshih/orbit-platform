import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import Footer from '../../components/Footer';

// Images
import Logo from '../../images/orbit_logo_small.png';
import IntroductionLeft from '../../images/introduction_left.png';
import IntroductionRight from '../../images/introduction_right.png';

// Styles
import './LoginRoute.sass';

function LoginRoute() {
  return (
    <Fragment>
      <div className="login-page">

        <section className="login">

          <img className="login-introduction left" src={IntroductionLeft} alt="ORBIT Introduction" />

          <div className="login-wrapper">
            <div className="login-description">
              <div className="branding">
                <img src={Logo} alt="ORBIT" />
              </div>
              <p>Welcome to ORBIT: Online Resource for Building Intercultural Teams, where we connect faculty with diverse perspectives across classrooms, disciplines, or continents.</p>
              <p>We help higher education faculty find collaboration opportunities. Login today to contact potential collaborators who are passionate about bringing global challenges into their teaching and research.</p>
            </div>

            <LoginForm />

            <div className="login-help">
              <p>
                <span>Not yet collaborating on ORBIT? </span>
                <Link to="/register">Create a free account</Link>
              </p>
              <p>
                <span>Forgot your password? </span>
                <Link to="/password/forgotten">Reset password</Link>
              </p>
            </div>
          </div>

          <img className="login-introduction right" src={IntroductionRight} alt="ORBIT Introduction" />

          
        </section>

      </div>
      <Footer />
    </Fragment>
  );
}

export default LoginRoute;
