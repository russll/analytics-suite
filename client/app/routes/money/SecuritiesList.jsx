import React, { Component } from 'react';
import Relay from 'react-relay';
import TreeGrid from 'components/temporary/TreeGrid/TreeGrid.jsx';
import { basLivingMoney } from '../../api/analytics/bas-livingmoney.js';
import Securities from 'components/temporary/Money/Securities.jsx';

import DataParse from '../../lib/DataParse.js';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

import BasePaper from 'components/layouts/BasePaper/BasePaper.jsx'
import { AppBar, Paper, IconMenu, IconButton, MenuItem, FontIcon, Styles, Slider, Card, CardHeader, CardText, CardActions, Avatar, FlatButton, CardMedia, CardTitle, List, ListItem, ListDivider, GridTile, GridList, Tabs, Tab, DatePicker, DatePickerDialog, Dialog } from 'material-ui';
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx'

let { Colors, Typography } = Styles;
let dp = new DataParse();


class SecuritiesList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      json: {},
      normalized: [],
      modalFocaData: {},
      modalIntLendData: {},
      modalSecurData: {},
      stop: false
    };
    //this.props.relay.setVariables({ date : this.props.date });
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  componentDidMount() {
  }

  render() {
    let data;
//
    if (this.props.analytics &&
      this.props.analytics.livingMoneySecurities &&
      this.props.analytics.livingMoneySecurities.securities &&
      this.props.analytics.livingMoneySecurities.securities.length
    ) {
      data = (<Securities modalSecurData={this.props.analytics} date={this.props.date}/>);
    } else {
      data = (<Securities modalSecurData={null}/>);
    }

    return (
      <BaseStore appBar={{title: "Ликвидные средства"}}>
        <div className='borr_card'>
          {data}
        </div>
      </BaseStore>
    );
  }
}

export default Relay.createContainer(SecuritiesList, {
  initialVariables: {
    date: "2015-11-01"
  },
  fragments: {
    analytics: () => Relay.QL`
      fragment on Analytics {
        livingMoneySecurities(date: $date){
          nonState{
            value,
            currency,
            percent
          },
          state{
            value,
            currency,
            percent
          },
          total{
            value,
            currency
          },
          securities{
            isState,
            name,
            price{
              value,
              currency
            }
          }
        }
      }
    `
  }
});