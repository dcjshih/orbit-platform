import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Page.sass';

function Page(props) {
  const { children } = props;
  return (
    <Fragment>
      <Navbar />
      <main className="page">
        <main className="page-container">
          { children }
        </main>
      </main>
      <Footer />
    </Fragment>
  );
}

export default Page;
