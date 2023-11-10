import React from 'react';
import './Card.sass';

function Card(props) {
  const { children, className } = props;
  let cardClass = 'card';
  if (className) cardClass += ` ${className}`;

  return (
    <div className={cardClass}>
      { children }
    </div>
  );
}

export default Card;
