import React, { Component } from 'react';
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx';
import Tile from 'app/components/temporary/Tile/Tile.jsx';

import getMenu from 'app/services/non-standard-menus.js';
let menuItems = getMenu('admin');

export default class Admin extends Component {

  render () {

    return (
      <BaseStore menuItems={menuItems} breadcrumbsDisable={true}>
        <Tile title="Пользователи" route="/admin/users" />
        <Tile title="Логи" route="/admin/logs" />
      </BaseStore>
    );

  }

}