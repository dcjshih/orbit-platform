import React from 'react';
import PropTypes from 'prop-types';
import ClassEntry from '../ClassEntry';
import Button from '../Button';
import './ClassComposer.sass';

function ClassComposer(props) {
  const {
    classes,
    updateClass,
    addClass,
    deleteClass,
  } = props;

  const classList = classes.map((klass) => (
    <ClassEntry
      key={klass.id}
      id={klass.id}
      name={klass.name}
      start={klass.start}
      end={klass.end}
      handleChange={updateClass}
      deleteClass={deleteClass}
      count={classes.length}
    />
  ));

  return (
    <div className="class-composer">
      { classList }
      <Button
        label="Add another course"
        className="primary"
        type="button"
        onClick={addClass}
      />
    </div>
  );
}

ClassComposer.propTypes = {
  classes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }).isRequired,
  ).isRequired,
  updateClass: PropTypes.func.isRequired,
  addClass: PropTypes.func.isRequired,
  deleteClass: PropTypes.func.isRequired,
};

export default ClassComposer;
