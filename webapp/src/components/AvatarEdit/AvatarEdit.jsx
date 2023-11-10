import React, { Component } from 'react';
import axios from 'axios';
import Icon from '../Icon';
import './AvatarEdit.sass';

class AvatarEdit extends Component {
  constructor() {
    super();
    this.state = { photo: false };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImageInputChange = this.handleImageInputChange.bind(this);
  }

  handleImageInputChange(event) {
    const { target } = event;
    const { files } = target;
    let photo;

    if (files.length === 0) {
      this.setState({ photo: false });
    } else {
      photo = files.item(0);
      this.setState({ photo });
      this.handleSubmit(photo);
    }
  }

  handleSubmit(photo) {
    const token = localStorage.getItem('token');
    const { person } = this.props;

    if (photo) {
      const formData = new FormData();
      formData.append('files', photo);
      formData.append('ref', 'user');
      formData.append('refId', person.id);
      formData.append('field', 'photo');
      formData.append('source', 'users-permissions');

      axios({
        method: 'POST',
        url: `${API_URL}/upload`,
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'multipart/form-data',
        },
        data: formData,
      })
        .then((response) => {
          const { data } = response;
          const newPhoto = data[0].formats.thumbnail.url;
          this.setState({ newPhoto });
        })
        .catch((error) => {
          if (error.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          } else {
            console.error('An error occurred: ', error);
          }
        });
    }
  }

  render() {
    const { person } = this.props;
    const { newPhoto } = this.state;

    // Profile image
    const defaultImage = 'none';
    let image = defaultImage;
    if (newPhoto) {
      image = `${API_URL}/${newPhoto}`;
    } else if (person.photo) {
      image = `${API_URL}${person.photo[0]}`;
    }

    return (
      <form className="avatar">
        <label style={{ backgroundImage: `url(${image})` }}>
          <input
            type="file"
            name="files"
            accept="image/png, image/jpeg"
            onChange={this.handleImageInputChange}
          />
          <div className="avatar-tint" />
          <Icon type="add-a-photo" />
        </label>
      </form>
    );
  }
}

export default AvatarEdit;
