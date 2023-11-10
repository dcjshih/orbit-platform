import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Avatar from '../Avatar';
import Tooltip from '../Tooltip';
import Card from '../Card';
import './CardPerson.sass';

function CardPerson(props) {
  const { person } = props;

  const matchIndicator = person.goals.map((goal, index) => (
    <span className="match" key={goal}>
      <Tooltip label={goal} />
    </span>
  ));

  return (
    <Card className="person">
      <Link to={`/people/${person._id}`}>
        <div className="card-container">
          <Avatar person={person} />
          <div className="card-metadata">
            <div className="card-title">{person.name}</div>
            <div className="card-institution">
              {person.institution}
            </div>
          </div>
          { person.goals.length > 0 && (
            <div className="card-matches">
              { matchIndicator }
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
}

CardPerson.propTypes = {
  person: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    goals: PropTypes.arrayOf(PropTypes.string).isRequired,
    institution: PropTypes.string.isRequired,
  }).isRequired,
};

export default CardPerson;
