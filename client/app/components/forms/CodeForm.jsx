import React, { Component } from 'react';
import { RaisedButton, TextField } from 'material-ui';

var RESEND_DELAY = 60000;

var i18n = {
  enterCode: "Введите код",
  enterNewCode: "Введите новый код",
  submit: "Отправить",
  canSendIn: "Код можно будет получить повторно через <%sec%> секунд",
  sendAgain: "Выслать код ещё раз",
  sendingNewCode: "Отправляем новый код",
  sendingFailed: "Не удалось отправить новый код",
};

export default class extends Component {

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.setState({resendLabel: i18n.sendAgain});
    this._delayButtonShow();
  }

  _submitHandler = (e) => {
    e.preventDefault();
    this.props.action({code: this.refs.code.getValue()}, () => {
      clearTimeout(this._buttonTimer);
      clearTimeout(this._resendTimer);
    });
  }

  _onResend() {

    this.setState({
      resendMessage: i18n.sendingNewCode,
      showResendButton: false,
    });

    this._delayButtonShow();

    this.props.resend({
      success: () => {
        this.setState({resendMessage: i18n.enterNewCode});
      },
      error: () => {
        this.setState({resendMessage: i18n.sendingFailed});
      },
    });

  }

  _delayButtonShow() {

    this._setResendTimer();
    clearTimeout(this._buttonTimer);

    this._buttonTimer = setTimeout(() => {
      this.setState({showResendButton: true});
      this._unsetResendTimer();
    }, RESEND_DELAY);

  }

  _setResendTimer(time) {

    if (time === 0) {
      this._unsetResendTimer();
      return;
    }

    time = time || (RESEND_DELAY / 1000);
    this.setState({resendTimer: time});

    this._resendTimer = setTimeout(() => {
      this._setResendTimer(time - 1);
    }, 1000);

  }

  _unsetResendTimer() {
    this.setState({resendTimer: 0});
    clearTimeout(this._resendTimer);
  }

  render() {

    var resendTimer;
    var resendMessage;
    var resendCodeButton;

    if (this.state.resendTimer) {
      resendTimer = <div>{i18n.canSendIn.replace('<%sec%>', this.state.resendTimer)}</div>;
    }

    if (this.state.resendMessage) {
      resendMessage = <div>{this.state.resendMessage}</div>;
    }

    if (this.state.showResendButton) {
      resendCodeButton = <RaisedButton type="button" label={this.state.resendLabel} onClick={this._onResend.bind(this)}/>;
    }

    return (
      <form className="codeForm" onSubmit={this._submitHandler.bind(this)}>
        {resendMessage}
        <TextField ref="code" hintText={i18n.enterCode} floatingLabelText={i18n.enterCode} autoComplete="off" autoFocus={true}/>
        <br />
        <br />
        <RaisedButton type="submit" label={i18n.submit} secondary={true}/>
        <br />
        <br />
        <br />
        {resendTimer}
        {resendCodeButton}
      </form>
    );
  }

}
