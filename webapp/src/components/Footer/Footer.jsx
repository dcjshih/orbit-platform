import React from 'react';
import './Footer.sass';

function Footer() {
  return (
    <footer>
      <div className="footer-wrapper">
        <p>{`© University of Michigan, ${new Date().getFullYear()}`}</p>
        <p>
          <span>ORBIT Teams is a work in progress, created by </span>
          <a href="https://stamps.umich.edu/people/detail/kelly_murdoch_kitt" target="_blank" rel="noreferrer">Kelly Murdoch-Kitt</a>
          <span> and her research team.</span>
          <br />
          <span>Please visit </span>
          <a href="http://orbit-project.com/" target="_blank" rel="noreferrer">orbit-project.com</a>
          <span> for more information.</span>
        </p>

      </div>
    </footer>
  );
}

export default Footer;
