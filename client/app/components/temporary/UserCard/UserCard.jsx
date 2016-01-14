import React, { Component } from 'react';
import { Card, CardHeader } from 'material-ui';
import UserAvatar from 'app/components/temporary/UserAvatar/UserAvatar.jsx';

import { auth } from 'app/api/analytics/auth.js';
import user from 'app/services/user.js';
import wrapComponent from 'app/lib/wrapComponent.js';

export default class UserCard extends Component {

  constructor () {
    super();
    this.state = {
      user: user.get('email firstName lastName')
    };
  }

  componentDidMount () {
    auth.detail(user.get('id'), (res) => {
      this.setState({ user: res.data });
    });
  }

  render () {

    let u = this.state.user || {};
    let longFieldStyle = {
      marginTop: '24px',
      overflow: 'hidden',
      width: '140px',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };
    let longFieldEmailStyle = Object.assign({}, longFieldStyle);
    let username = (u.firstName && u.lastName) ? u.firstName + ' ' + u.lastName : 'Пользователь';
    let email = u.email || null;

    delete longFieldEmailStyle.marginTop;
    let usernameCut = (<div title={this.props.value} style={longFieldStyle}>{username}</div>);
    let emailCut = (<div style={longFieldEmailStyle}>{email}</div>);

    let usernameCutWrapper = wrapComponent(usernameCut, {
      toString () {
        return username;
      }
    });

    return (
      <Card initiallyExpanded={false}>
        <CardHeader
          style={{height: 'auto'}}
          title={usernameCutWrapper}
          subtitle={emailCut}
          avatar={<UserAvatar username={username} />}
          actAsExpander={false}
          showExpandableButton={false}
        />
      </Card>
    );

  }

}