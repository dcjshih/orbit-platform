import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import FormField from '../FormField';
import TextArea from '../TextArea';
import Button from '../Button';
import Icon from '../Icon';
import './ModalReport.sass';

class ModalReport extends Component {
  constructor() {
    super();

    this.state = {
      description: '',
    };

    this.token = localStorage.getItem('token');

    // Context binding
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { reported, reportedBy, type, close } = this.props;
    const { description } = this.state;

    axios({
      method: 'POST',
      url: `${API_URL}/reports`,
      headers: { Authorization: `Bearer ${this.token}` },
      data: {
        reported,
        reported_by: reportedBy,
        type,
        description,
      },
    })
      .then(() => close('modalReport'))
      .catch((error) => console.error('Error while reporting:', error));
  }

  render() {
    const { visibility, close } = this.props;
    const { description } = this.state;

    if (!visibility) return null;

    return (
      <Fragment>
        <div
          className="modal-background"
          onClick={() => close('modalReport')}
        />
        <div className="modal report">
          <form onSubmit={this.handleSubmit}>
            <div className="modal-header">
              <h2>Report an issue</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => close('modalReport')}
              >
                <Icon type="clear" />
              </button>
            </div>

            <div className="modal-body">
              <FormField
                label="Description"
              >
                <TextArea
                  name="description"
                  value={description}
                  onChange={this.handleInputChange}
                  placeholder="Please describe the issue"
                />
              </FormField>
            </div>

            <div className="modal-footer">
              <Button
                className="secondary"
                label="Cancel"
                type="button"
                onClick={() => close('modalReport')}
              />
              <Button className="primary" label="Report" />
            </div>
          </form>
        </div>
      </Fragment>
    );
  }
}

ModalReport.propTypes = {
  reported: PropTypes.string.isRequired,
  reportedBy: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  visibility: PropTypes.bool.isRequired,
};

export default ModalReport;
