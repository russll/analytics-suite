import React, { Component } from 'react';
import { Avatar } from 'material-ui';
import FileInput from 'app/components/forms/FileInput.jsx';

import { auth } from 'app/api/analytics/auth.js';
import user from 'app/services/user.js';

import './UserAvatar.styl';

export default class extends Component {

  constructor() {
    super();
    this.state = {
      avatar: user.get('avatar'),
    };
  }

  componentDidMount() {
    if (!this.state.avatar) {
      this._updatePath();
    }
  }

  _updatePath() {
    auth.detail(user.get('id'), (res) => {
      this.setState({avatar: res.data.avatar});
    });
  }

  _formSubmit() {

    var file = this.refs.avatar.value;

    if (!file) {

      this._error('Не выбран файл!');

    } else {

      var fd = new FormData();

      fd.append('mugshot', file);
      fd.append('userId', user.get('id'));

      auth.uploadAvatar({
        data: fd,
        success: this._success.bind(this),
        error: this._error.bind(this),
      });

      // TODO : If you want more UX, do like that: app/routes/Upload.jsx.

    }

  }

  _success() {
    this._updatePath();
  }

  _error(msg) {
    // TODO : MOAR UX HERE.
    alert(msg || 'Произошла ошибка! Аватарка не загружена!');
  }

  render() {

    var avatar;
    var size = 60;
    var letter = (typeof this.props.username === 'string') ? this.props.username.charAt(0).toUpperCase() : 'U'; // U stands for User.

    if (this.state.avatar && this.state.avatar.url) {
      avatar = (<Avatar size={size} src={this.state.avatar.url}/>);
    } else {
      avatar = (<Avatar size={size}>{letter}</Avatar>);
    }

    return (
      <div className="user-avatar">
        {avatar}
        <FileInput className="user-avatar__upload-new" ref="avatar" label="" onChange={this._formSubmit.bind(this)}/>
      </div>
    );

  }

}
