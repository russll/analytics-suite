import React, { Component } from 'react';
import { RaisedButton, TextField } from 'material-ui';

export default class extends Component {

  _submitHandler(e) {
    e.preventDefault(); // TODO : Find an overall solution for this preventing.
    this.props.action({
      login: this.refs.login.getValue(),
      password: this.refs.password.getValue(),
    });
  }

  render() {
    return (
      <form className="loginForm" onSubmit={this._submitHandler.bind(this)}>
        <TextField ref="login" hintText="Имя пользователя" floatingLabelText="Имя пользователя" autoComplete="off" autoFocus={true}/>
        <TextField ref="password" hintText="Пароль" floatingLabelText="Пароль" type="password"/>
        <br />
        <br />
        <RaisedButton type="submit" label="Войти" />
      </form>
    );
  }

}
