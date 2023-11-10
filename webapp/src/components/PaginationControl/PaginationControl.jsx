import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import './PaginationControl.sass';

class PaginationControl extends Component {
  constructor() {
    super();

    // Context binding
    this.changePage = this.changePage.bind(this);
  }

  changePage(change) {
    const {
      start,
      setStart,
      count,
      limit,
    } = this.props;

    const desiredStart = start + (limit * change);

    if (desiredStart >= 0 && desiredStart <= count) {
      setStart(desiredStart);
    }
  }

  render() {
    const { start, count, limit } = this.props;
    const currentPage = start / limit + 1;
    const lastPage = Math.ceil(count / limit);

    return (
      <Fragment>
        { lastPage > 1 && (
          <div className="pagination-controls">
            <Button
              label="Previous"
              type="button"
              className={currentPage === 1 ? 'disabled' : ''}
              onClick={() => this.changePage(-1)}
            />
            <div className="pagination-metadata">
              <span>Page </span>
              <span>{currentPage}</span>
              <span> of </span>
              <span>{lastPage}</span>
            </div>
            <Button
              label="Next"
              type="button"
              className={currentPage === lastPage ? 'disabled' : ''}
              onClick={() => this.changePage(1)}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

PaginationControl.propTypes = {
  count: PropTypes.number.isRequired,
  start: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  setStart: PropTypes.func.isRequired,
};

export default PaginationControl;
