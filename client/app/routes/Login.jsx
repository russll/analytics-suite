import React, { Component } from 'react';
import Authorization from 'app/components/forms/Authorization.jsx';

import './Login.styl';

export default class extends Component {
  render() {
    return (
      <div>
        <div className='i-bas-logo'>
          <div className='i-bas-store'>
            <img src='/img/ibas.png' alt='i-Bas logo' width='128' height='128'/>
            <div className='i-bas'>iBAS</div>
          </div>
        </div>
        <Authorization authService='analytics' moveTo='/'/>
        {this.props.children}
      </div>
    );
  }

}
