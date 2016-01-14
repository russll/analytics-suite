import React, { Component } from 'react';

import { History, Link } from 'react-router';

import LoginForm from './LoginForm.jsx';
import CodeForm from './CodeForm.jsx';
import InlineError from '../errors/InlineError.jsx';
import Loading from 'app/components/dumb/Loading.jsx';

import { auth as authRBS } from '../../api/rbs/auth.js';
import { auth as authAnalytics } from '../../api/analytics/auth.js';
import { auth as authBackOffice } from '../../api/back-office/auth.js';

import history from 'app/services/history.js';

import './Authorization.styl';

var authServices = {
  rbs: authRBS,
  analytics: authAnalytics,
  'back-office': authBackOffice,
};

export default class extends Component {

  constructor() {
    super();
    this.state = {step: 'login'};
  }

  componentDidMount() {
    this.auth = authServices[this.props.authService];
  }

  _authorization(credentials) {

    this.auth.authorize({
      data: credentials,
      success: (res) => {
        if (res.data.twoFactorEnabled) {
          this.setState({step: 'code', err: null});
        } else {
          this._success();
        }
      },
      error: (err) => {
        this._error(err.message);
      }
    });

    this.setState({step: 'wait', err: null});

  }

  _verification(credentials, callback) {

    this.auth.verify({
      data: credentials,
      success: () => {
        callback();
        this._success();
      },
      error: (err) => {
        this._error(err.message);
      }
    });

    this.setState({step: 'wait'});

  }

  _resendCode(handlers) {
    this.auth.verify({
      data: {resend: 1},
      success: handlers.success,
      error: handlers.error,
    });
  }

  _success() {
    window.location.reload(); // FIXME : Поменять структуру роутера. Он не должен быть в if'е и callback'е.
  }

  _error(err) {
    err = err || 'Потеряно соединение.';
    this.setState({step: 'login', err});
  }

  render() {

    var currentForm;
    var currentErr;

    if (this.state.step === 'login') {
      currentForm = <LoginForm action={this._authorization.bind(this)}/>;
    } else if (this.state.step === 'code') {
      currentForm = <CodeForm action={this._verification.bind(this)} resend={this._resendCode.bind(this)}/>;
    } else if (this.state.step === 'wait') {
      currentForm = <Loading text="Пожалуйста, подождите..."/>;
    }

    if (this.state.err) {
      currentErr = <InlineError message={this.state.err}/>;
    }

    return (
      <div className="authorization">

        {currentErr}
        {currentForm}
      </div>
    );
  }

}
