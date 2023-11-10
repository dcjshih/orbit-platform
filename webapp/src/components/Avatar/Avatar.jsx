import React from 'react';
import './Avatar.sass';

function Avatar(props) {
  const { person } = props;

  // Profile image
  const defaultImage = 'none';
  let image = defaultImage;
  if (person.photo[0]) {
    image = `url(${API_URL}/${person.photo[0]})`;
  }

  return (
    <div
      className="avatar"
      style={{ backgroundImage: image }}
    />
  );
}

export default Avatar;
