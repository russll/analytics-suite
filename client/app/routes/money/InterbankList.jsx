import React, { Component } from 'react';
import Relay from 'react-relay';
import TreeGrid from 'components/temporary/TreeGrid/TreeGrid.jsx';
import { basLivingMoney } from '../../api/analytics/bas-livingmoney.js';
import InterbankLending from 'components/temporary/Money/InterbankLending.jsx';

import DataParse from '../../lib/DataParse.js';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';


import BasePaper from 'components/layouts/BasePaper/BasePaper.jsx'
import { AppBar, Paper, IconMenu, IconButton, MenuItem, FontIcon, Styles, Slider, Card, CardHeader, CardText, CardActions, Avatar, FlatButton, CardMedia, CardTitle, List, ListItem, ListDivider, GridTile, GridList, Tabs, Tab, DatePicker, DatePickerDialog, Dialog } from 'material-ui';
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx'

let { Colors, Typography } = Styles;
let dp = new DataParse();


class InterbankList extends Component {

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
    return (
      <BaseStore appBar={{title: "Ликвидные средства"}}>
        <div className='borr_card'>
          <InterbankLending modalIntLendData={this.props.analytics} date={this.props.date}/>
        </div>
      </BaseStore>
    );
  }
}

export default Relay.createContainer(InterbankList, {
  initialVariables: {
    date: "2015-11-01"
  },
  prepareVariables: prevVariables => {
    return {
      ...prevVariables
    };
  },
  fragments: {
    analytics: () => Relay.QL`
      fragment on Analytics {
        livingMoneyInterbankLending(date: $date){
            counteragents{
              bankNumber,
              bankTitle,
              daysCount,
              income{
                currency,
                value,
                percent,
                label
              },
              interestRate,
              isState,
              placementDate,
              returnDate,
              sum{
                currency,
                value,
                percent,
                label
              }
            }
            nonState{
                currency,
                value,
                percent,
                label
            },
            state{
                currency,
                value,
                percent,
                label
            },
            total{
                currency,
                value,
                percent,
                label
            },
            totalIncome{
                currency,
                value,
                percent,
                label
            },
            weightedAverageRate
          }
      }
    `
  }
});
