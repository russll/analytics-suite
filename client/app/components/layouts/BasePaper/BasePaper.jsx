import React, { Component } from 'react';

import AppBar from 'material-ui/lib/app-bar';
import Classnames from 'classnames';
import Theme from 'styles/theme';
import Paper from 'material-ui/lib/paper';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import './BasePaper.styl';

class BasePaper extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      window: {
        innerWidth: window.innerWidth,
      },
    };
  }

  static defaultProps = {
    appBar: {
      title: 'BAS',
      big: false,
      iconElementLeft: null,
      iconElementRight: null,
      onLeftIconButtonTouchTapAppBarHandler: null,
      onRightIconButtonTouchTapAppBarHandler: null,
    },
    paper: {
      left: false,
    },
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired,
  };

  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(Theme),
    };
  };

  componentDidMount() {
    window.addEventListener('resize', this._onResizeHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResizeHandler);
  }

  _onLeftIconButtonTouchTapAppBarHandler = (e)=> {
    e.preventDefault();
    this.context.history.goBack();
  }

  _onChangeLeftNavHandler = (e, selectedIndex, menuItem)=> {
    e.preventDefault();
    this.context.history.pushState(null, menuItem.route);
  }

  _onResizeHandler = ()=> {
    this.setState({window: {innerWidth: window.innerWidth}});
  }

  render() {
    return (
      <Paper className={Classnames({'base-paper':true, 'base-paper_left':this.props.paper.left})} zDepth={5}>
        <div className='base-paper__appbar-store'>
          <AppBar
            showMenuIconButton={false}
            title={this.props.appBar.title}
            onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTapAppBarHandler}
            onRightIconButtonTouchTap={this._onRightIconButtonTouchTapAppBarHandler}
            iconElementLeft={this.props.appBar.iconElementLeft}
            iconElementRight={this.props.appBar.iconElementRight}
          />
        </div>
        {this.props.children}
      </Paper>
    );
  }

}

export default BasePaper;
