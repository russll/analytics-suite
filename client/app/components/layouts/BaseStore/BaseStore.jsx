import React, { Component } from 'react';
import { Link } from 'react-router';
import Classnames from 'classnames';
import { AppBar, LeftNav, Styles, IconMenu, IconButton } from 'material-ui';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/lib/menus/menu-item';
import breadcrumbsDict from 'app/router/breadcrumbs.json';

import UserCard from 'app/components/temporary/UserCard/UserCard.jsx';
import basConfig from '../../../../../data/bas.config.json';
import Theme from 'app/styles/theme.js';
const injectTapEventPlugin = require('react-tap-event-plugin');

import './BaseStore.styl';

let { ThemeManager } = Styles;

injectTapEventPlugin();

export default class BaseStore extends Component {

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
    leftNav: {
      enabled: true
    }
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired
  }

  getChildContext () {
    return {
      muiTheme: ThemeManager.getMuiTheme(Theme)
    };
  }

  componentDidMount () {
    window.addEventListener('resize', this._onResizeHandler);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._onResizeHandler);
  }

  _onLeftIconButtonTouchTapAppBarHandler = (e) => {
    if (this.props.leftNav.enabled) {
      e.preventDefault();
      this.refs.leftNav.toggle();
    }
    this.props.appBar.onLeftIconButtonTouchTapAppBarHandler ? this.props.appBar.onLeftIconButtonTouchTapAppBarHandler() : null;
  }

  _onRightIconButtonTouchTapAppBarHandler = () => {
    this.props.appBar.onRightIconButtonTouchTapAppBarHandler ? this.props.appBar.onRightIconButtonTouchTapAppBarHandler() : null;
  }

  _onChangeLeftNavHandler = (e, selectedIndex, menuItem) => {
    e.preventDefault();
    this.context.history.pushState(null, menuItem.route);
  }

  _onResizeHandler = () => {
    this.setState({window: {innerWidth: window.innerWidth}});
  }

  _generateBreadcrumbs () {

    if (location.pathname.length < 2) return undefined;

    let url = location.pathname.split('/').map(function (item) {
      return breadcrumbsDict[item] ? item : null;
    }).filter(function (item) {
      return (item !== null);
    });

    let last = url.length - 1;
    if (url[last] === 'borrowers-client-loan-portfolio-report' ||
        url[last] === 'borrowers-client-saldo-report') {
      url.splice(last, 0, 'borrowers-report');
    }

    let crumbs = url.map(function (item, index) {
      let title = breadcrumbsDict[item];
      if (index + 1 === url.length) {
        return (<span key={index}>{title}</span>);
      } else {
        let path = url.slice(0, index + 1).join('/') || '/';
        return (
          <span key={index}>
            <Link to={path}>{title}</Link>
            <span>&nbsp;/&nbsp;</span>
          </span>
        );
      }
    });

    return (<div className="breadcrumbs">{crumbs}</div>);

  }

  _moveTo (path) {
    this.context.history.pushState(null, path);
  }

  render() {

    let breadcrumbs;
    if (this.props.breadcrumbsDisable) {
      breadcrumbs = (<div className="breadcrumbs"></div>);
    } else {
      breadcrumbs = this._generateBreadcrumbs();
    }

    let menuItems = this.props.menuItems || [
      { route: '/', text: 'Главная' },
      { route: '/borrowers', text: basConfig.borrowers },
      { route: '/cashflow', text: basConfig.cashflow },
      { route: '/non-balance-assets', text: basConfig.assets },
      { route: '/revenues-expenses', text: basConfig.revenuesExpenses },
      { route: '/money', text: basConfig.money },
      { disabled: true },
      { disabled: true },
      { route: '/logout', text: 'Выход' }
    ];

    let leftnav;

    if (this.props.leftNav.enabled) {
      leftnav = (<LeftNav
        disableSwipeToOpen={true}
        className='base-store__left-nav'
        ref="leftNav"
        docked={false}
        header={<UserCard />}
        menuItems={menuItems}
        onChange={this._onChangeLeftNavHandler}
      />);
    }

    let rightMenu = (
      <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
        <MenuItem primaryText="Загрузка файлов" onClick={this._moveTo.bind(this, '/upload')} />
        <MenuItem primaryText="Администрирование" onClick={this._moveTo.bind(this, '/admin' )} />
      </IconMenu>
    );

    return (
      <div className='base-store'>
        <div className='base-store__content'>
          {breadcrumbs}
          {this.props.children}
        </div>
        <AppBar
          style={{position: 'fixed'}}
          className={Classnames({'base-store__appbar':true, 'base-store__appbar_big':this.props.appBar.big})}
          title={this.props.appBar.title}
          showMenuIconButton={true}
          onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTapAppBarHandler}
          onRightIconButtonTouchTap={this._onRightIconButtonTouchTapAppBarHandler}
          iconElementLeft={this.props.appBar.iconElementLeft}
          iconElementRight={rightMenu}
        />
        {leftnav}
      </div>
    );
  }

}
