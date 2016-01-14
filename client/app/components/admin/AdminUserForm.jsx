import React, { Component } from 'react';
import { RaisedButton, TextField, Toggle, Avatar } from 'material-ui';
import FileInput from 'app/components/forms/FileInput.jsx';

export default class AdminUserForm extends Component {

  _submit = () => {

    let data = new FormData();

    for (let key in this.refs) {
      if (this.refs.hasOwnProperty(key)) {
        let ref = this.refs[key];
        if (ref.getValue) {
          data.append(key, ref.getValue());
        } else if (ref.isToggled) {
          data.append(key, ref.isToggled() ? 1 : 0);
        } else if (ref.value) {
          data.append(key, ref.value);
        } else {
          data.append(key, ref);
        }
      }
    }

    this.props.onSubmit(data);

  }

  render () {

    let user = this.props.user;

    let userId;
    let password;

    if (!user.userId) {
      password = (
        <div>
          <TextField ref="password" type="password" hintText="Пароль" floatingLabelText="Пароль" />
          <br />
        </div>
      );
    } else {
      userId = (<input ref="userId" type="hidden" value={user.userId} />);
    }

    let avatar;
    if (this.props.user.avatar) {
      avatar = (<Avatar size={60} src={this.props.user.avatar.url} />);
    } else {
      avatar = (<Avatar size={60}>A</Avatar>);
    }

    let avatarBlock = (
      <div>
        {avatar}
        <FileInput ref="avatar" label="Аватар"/>
      </div>
    );

    return (
      <form>
        {userId}
        {avatarBlock}
        <br />
        <TextField ref="login" hintText="Логин" floatingLabelText="Логин" defaultValue={user.login} />
        <br />
        {password}
        <TextField ref="firstName" hintText="Имя" floatingLabelText="Имя" defaultValue={user.firstName} />
        <br />
        <TextField ref="lastName" hintText="Фамилия" floatingLabelText="Фамилия" defaultValue={user.lastName} />
        <br />
        <TextField ref="phoneNumber" hintText="Телефон" floatingLabelText="Телефон" defaultValue={user.phoneNumber} />
        <br />
        <TextField ref="email" hintText="Email" floatingLabelText="Email" defaultValue={user.email} />
        <br />
        <Toggle ref="isActive" defaultToggled={user.isActive} label="Активен" />
        <br />
        <Toggle ref="isSuperuser" defaultToggled={user.isSuperuser} label="Superuser" />
        <br />
        <Toggle ref="twoFactorEnabled" defaultToggled={user.twoFactorEnabled} label="Двухфакторная авторизация" />
      </form>
    );

  }

}