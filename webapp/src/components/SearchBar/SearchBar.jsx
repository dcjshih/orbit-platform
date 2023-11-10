import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import './SearchBar.sass';

function SearchBar(props) {
  const { placeholder, value, onChange } = props;
  return (
    <div className="search-bar">
      <div className="search-bar-wrapper">
        <label>
          <input
            type="text"
            name="search"
            placeholder={placeholder}
            className="people-search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
          <Icon type="search" />
        </label>
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  placeholder: 'Search',
  value: '',
};

export default SearchBar;
