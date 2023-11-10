import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import './ListTag.sass';

function ListTag(props) {
  const { id, type, label, descriptor, add, remove } = props;

  // Conditional rendering flags
  const isLink = !!id && !!type;
  const hasTools = !!add || !!remove;

  return (
    <li className="list-tag">

      { isLink && (
        <Link to={`/${type}/${id}`} className="list-tag-label">
          { label }
          { !!descriptor && (
            <span className="list-tag-descriptor">{ descriptor }</span>
          )}
        </Link>
      )}

      { !isLink && (
        <div className="list-tag-label">
          { label }
          { !!descriptor && (
            <span className="list-tag-descriptor">{ descriptor }</span>
          )}
        </div>
      )}

      { (!!id && hasTools) && (
        <div className="list-tag-tools">
          {!!add && <Icon type="done" onClick={() => add(id)} /> }
          {!!remove && <Icon type="clear" onClick={() => remove(id)} /> }
        </div>
      )}
    </li>
  );
}

ListTag.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  descriptor: PropTypes.string,
  add: PropTypes.func,
  remove: PropTypes.func,
};

ListTag.defaultProps = {
  id: '',
  type: '',
  descriptor: '',
};

export default ListTag;
