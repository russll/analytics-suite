import React, { Component } from 'react';
import { auth } from '../api/analytics/auth.js';

export default class Logout extends Component {

  render () {
    auth.logout();
    // TODO : После правки роутера добавить сюда переход по history.
    return (<div></div>);
  }

}