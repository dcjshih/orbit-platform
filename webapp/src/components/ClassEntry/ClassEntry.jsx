import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from '../Grid';
import FormField from '../FormField';
import TextInput from '../TextInput';
import Icon from '../Icon';
import Tooltip from '../Tooltip';

import './ClassEntry.sass';

class ClassEntry extends Component {
  constructor() {
    super();
    this.updateClass = this.updateClass.bind(this);
  }

  updateClass(event) {
    const {
      name,
      start,
      end,
      id,
      handleChange,
    } = this.props;

    const definition = {
      id,
      name,
      start,
      end,
    };

    const { target } = event;
    definition[target.name] = target.value;
    handleChange(definition, id);
  }

  render() {
    const {
      name,
      start,
      end,
      id,
      deleteClass,
      count,
    } = this.props;

    return (
      <div className="class-entry">
        <Grid>

          <FormField
            label="Course name:"
            className="class-name"
          >
            <TextInput
              type="text"
              name="name"
              value={name}
              onChange={this.updateClass}
              placeholder="Please input the name of your course"
            />
          </FormField>

          <FormField
            label="Start date:"
            className="class-start"
          >
            <TextInput
              type="text"
              name="start"
              value={start}
              onChange={this.updateClass}
              placeholder="DD-MM-YYYY"
            />
          </FormField>

          <FormField
            label="End date:"
            className="class-end"
          >
            <TextInput
              type="text"
              name="end"
              value={end}
              onChange={this.updateClass}
              placeholder="DD-MM-YYYY"
            />
          </FormField>

          { count > 1 && (
            <div className="class-remove-button">
              <button
                type="button"
                onClick={() => deleteClass(id)}
              >
                <Icon type="delete" />
                <Tooltip label="Delete class" />
              </button>
            </div>
          )}

        </Grid>
      </div>
    );
  }
}

ClassEntry.propTypes = {
  name: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  deleteClass: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

export default ClassEntry;
