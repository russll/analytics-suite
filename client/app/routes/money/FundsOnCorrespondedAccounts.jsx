import React, { Component } from 'react';
import Relay from 'react-relay';
import TreeGrid from 'components/temporary/TreeGrid/TreeGrid.jsx';
import InOtherBanks from 'components/temporary/Money/InOtherBanks.jsx';

import DataParse from '../../lib/DataParse.js';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

import Utils from '../../lib/Utils.js'
import BasePaper from 'components/layouts/BasePaper/BasePaper.jsx'
import { AppBar, Paper, IconMenu, IconButton, MenuItem, FontIcon, Styles, Slider, Card, CardHeader, CardText, CardActions, Avatar, FlatButton, CardMedia, CardTitle, List, ListItem, ListDivider, GridTile, GridList, Tabs, Tab, DatePicker, DatePickerDialog, Dialog } from 'material-ui';
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx'

let { Colors, Typography } = Styles;
let dp = new DataParse();
let u = new Utils();

class FundsOnCorrespondedAccounts extends Component {

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
    let loadDate = this.props.date;
  }

  render() {

    return (
      <BaseStore appBar={{title: "Ликвидные средства"}}>
        <div className='borr_card'>
          <InOtherBanks data={this.props.analytics} date = {this.props.date}/>
        </div>
      </BaseStore>
    );
  }
}

export default Relay.createContainer(FundsOnCorrespondedAccounts, {
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
        livingMoneyOtherBanks(date: $date){
      		generalInformation{
            bankGrade{
              currency,
              value
            },
            bankTitle,
            isState,
            sumTotal{
              currency,
              value
            }
          },
          fundsOnCorrespondentAccountInOtherBanks{
            bankTitle,
            sum{
              percent,
              value,
              currency
            }
          },
          municipalStructure{
            state{
              percent,
              value,
              currency
            },
            nonState{
              percent,
              value,
              currency
            }
          },
          qualityStructure{
            high{
              percent,
              value,
              currency
            },
            low{
              percent,
              value,
              currency
            },
            medium{
              percent,
              value,
              currency
            }
          }
        }
      }
    `
  }
});