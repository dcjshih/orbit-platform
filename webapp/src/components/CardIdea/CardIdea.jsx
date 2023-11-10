import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import Card from '../Card';
import Tooltip from '../Tooltip';
import './CardIdea.sass';

function CardIdea(props) {
  const {
    idea,
    matches,
  } = props;

  // Conditional rendering flags
  const hasMatches = matches && matches.length > 0;

  const matchIndicator = [];
  if (matches) {
    for (let i = 0; i < matches.length; i += 1) {
      matchIndicator.push(
        <span className="match" key={i}>
          <Tooltip label={matches[i]} />
        </span>,
      );
    }
  }

  return (
    <Card className="idea">
      <Link to={`/ideas/${idea._id}`}>
        <div className="card-wrapper">

          <div className="card-metadata">
            <span className="card-title">{idea.title}</span>
            <span className="card-subtitle">
              <div className="bookmarks">
                <Icon type="bookmark" />
                <span>{ idea.bookmarked_count }</span>
              </div>
            </span>
          </div>

          { idea.goals.length > 0 && (
            <div className="card-matches">
              { matchIndicator }
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
}

CardIdea.propTypes = {
  idea: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    bookmarked_count: PropTypes.number.isRequired,
  }).isRequired,
  matches: PropTypes.arrayOf(PropTypes.string),
};

CardIdea.defaultProps = {
  matches: [],
};

export default CardIdea;
