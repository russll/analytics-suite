import React, { Component } from 'react';

import { Styles } from 'material-ui';
import Theme from 'styles/theme';

let { ThemeManager } = Styles;

export default class extends Component {

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
  };

  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
  };

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(Theme),
      history: this.context.history,
      location: this.context.location,
    };
  };

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }

}
