import React, { Component } from 'react';
import Relay from 'react-relay';
import TreeGrid from 'components/temporary/TreeGrid/TreeGrid.jsx';
import { basLivingMoney } from '../../api/analytics/bas-livingmoney.js';

import InOtherBanks from 'components/temporary/Money/InOtherBanks.jsx';
import InterbankLending from 'components/temporary/Money/InterbankLending.jsx';
import Securities from 'components/temporary/Money/Securities.jsx';
import DataParse from '../../lib/DataParse.js';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

//import Chart from 'chart.js';
import BarChart from '../../components/temporary/Charts/BarChart.jsx'
import Utils from '../../lib/Utils.js'
import BasePaper from 'components/layouts/BasePaper/BasePaper.jsx'
import { AppBar, Paper, IconMenu, IconButton, MenuItem, FontIcon, Styles, Slider, Card, CardHeader, CardText, CardActions, Avatar, FlatButton, CardMedia, CardTitle, List, ListItem, ListDivider, GridTile, GridList, Tabs, Tab, DatePicker, DatePickerDialog, Dialog } from 'material-ui';
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx'
import Loading from 'components/dumb/Loading.jsx';


let { Colors, Typography } = Styles;
let dp = new DataParse();
let utils = new Utils();

class Money extends Component {

  constructor(props) {
    super(props);
    this.state = {
      barData:[],
      loading: false,
      json: {},
      normalized: [],
      modalFocaData: {},
      modalIntLendData: {},
      modalSecurData: {},
      stop: false
    };
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    let results = this.props.analytics.livingMoneyDashboard.results;
    if(!results.length) return;

    let dateStart = results[0].date;
    let dateEnd = results[results.length - 1].date;
    let barData = dp.livingMoneySummary(results);

    this.setState({
      dateStart: new Date(dateStart.split('-')[0], dateStart.split('-')[1], dateStart.split('-')[2]),
      dateEnd: new Date(dateEnd.split('-')[0], dateEnd.split('-')[1], dateEnd.split('-')[2])
    });

    window.addEventListener('scroll', this._scrollHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._scrollHandler);
  }


  _handleCustomDialogCancel = () => {
    this.refs.modal1.dismiss();
    this.refs.modal2.dismiss();
    this.refs.modal3.dismiss();
  };

  _loadModalData = (date, row) => {

    if (row == 'Средства на корсчетах в иных Банках') {
//      this.context.history.pushState(null, '/money/fundsOnCorrespondedAccounts/' + date);
      this.context.history.pushState(null, utils.cPath('/money/fundsOnCorrespondedAccounts?',{date : date}));
    } else if (row == 'Межбанковское кредитование') {
      this.context.history.pushState(null, utils.cPath('/money/interbankList?',{date : date}));
    } else if (row == 'Ценные бумаги (с учетом 12,8% дисконта)') {
      this.context.history.pushState(null, utils.cPath('/money/securitiesList?',{date : date}));
    }
  };

  _scrollHandler = () =>{
    //heading money-table__header
    let thead = document.getElementsByClassName('money-table__header')[0];
    let tgreed = document.getElementsByClassName('treegrid')[0];
    let tgreedTop = tgreed.getBoundingClientRect().top;
    let firstTr = document.getElementsByClassName('money-table__header')[1];

    if(tgreedTop<64) {
      thead.classList.add("tab-header_sticked");
      firstTr.classList.add("first");
    } else {
      thead.classList.remove("tab-header_sticked");
      firstTr.classList.remove("first");
    }
  };

  _changePeriod = ()=> {
    this.props.relay.setVariables({
      sdate: utils.dts(this.state.dateStart),
      edate: utils.dts(this.state.dateEnd)
    }, (e)=> {
      this.setState({loading: !e.ready});
    });
  };

  _setStartDate = (a, b)=> {
    this.setState({dateStart: b});  //utils.dts(b)
  };

  _setEndDate = (a, b)=> {
    this.setState({dateEnd: b});
  };

  render() {

    let customActions = [
      <FlatButton
        label="Закрыть"
        secondary={true}
        onTouchTap={this._handleCustomDialogCancel}/>
    ];

    let dateFrom;
    let dateTo;
    let grid;
    let theme = this.context.muiTheme.rawTheme;
    let results = this.props.analytics.livingMoneyDashboard.results;
    let style = {
      chart: {padding: '20px 0'},
      filterTitle: {margin: '0 40px 0 0', position: 'relative', top: '-18px'},
      filter: {
        padding: '0'
      },
      borrCard: {
        textAligin: 'center'
      },
      table: {
        paddingBottom: '40px'
      },
      dates: {
        display: 'inline-block',
        width: '120px',
        margin: '0 20px 0 0',
        overflow: 'hidden'
      },
      appBar: {
        backgroundColor: theme.palette.primary2Color
        //color: theme.palette.primary1Color,
      },
      nodata: {
        padding: '0 0 40px 0'
      },
      header: {
        width: '460px',
        display: 'inline-block',
        verticalAlign: 'top',
        position: 'absolute',
        left: '0',
        top: '0',
        height: '100%',
        overflow: 'scroll'
      },
      headerWrapper: {
        paddingTop: '128px'
      },
      card: {
        backgroundColor: theme.palette.canvasColor
      },
      datePicker: {
        display: 'inline-block',
        marginLeft: '24px'
      }
    };

    let norm = dp.livingMoneyDashboardNormalize(results);
    let barData = dp.livingMoneySummary(results);

    let chartData = barData.labels.map((el, idx)=>{
      //console.log( barData.datasets[0].data[idx] );
      return {date:el, value: Number(barData.datasets[0].data[idx])*1000 }
    });

    dateFrom = (<DatePicker style={style.dates} value={ this.state.dateStart||new Date() }
                            formatDate={ (date)=>{return utils.dts(date,'/')} } hintText="дата начала" autoOk={true}
                            showYearSelector={true} onChange={this._setStartDate}/>);

    dateTo = (<DatePicker style={style.dates} value={ this.state.dateEnd||new Date() }
                          formatDate={ (date)=>{return utils.dts(date,'/')} } hintText="дата конца" autoOk={true}
                          showYearSelector={true} onChange={this._setEndDate}/>);

    if (this.state.loading) {
      grid = (<Loading />);
    } else {
      if (norm.length) {
        grid = (<TreeGrid showHead="true" showDetails="false" data={ norm } use="GridLineDiff" showDialog={false}
                          style={style.table} callDate={this._loadModalData}/>);
      } else {
        grid = (<div style={style.nodata}>Нет данных..</div>);
      }
    }
    let barOptions = {
      dropZeros : true,
      barWidth : 40,
      thousandSeparator : true,
      format : function(num){ return num/1000; }
    };
    return(
      <BaseStore appBar={{title: "Ликвидные средства: тыс. pуб.", big: false}}>
        <div className='borr_card centered'>
          <CardTitle />
          <div style={style.filter}><span style={style.filterTitle}>Период:</span>
            {dateFrom}
            {dateTo}
            <FlatButton style={style.filterTitle} secondary={true} label="Показать" onClick={this._changePeriod}/></div>
          <div style={style.chart}>
            <div style={{width:'600px',margin:'0 auto 20px',textAlign:'left'}}>Ликвидные средства, тыс. руб.</div>
            <BarChart data={chartData} maxWidth={800} height={400} yTickFormat="s" options={barOptions}/>
            
          </div>
          {grid}
        </div>
      </BaseStore>
    );

  }
}

export default Relay.createContainer(Money, {
  initialVariables: {
    sdate: '2015-01-01',
    edate: '2015-12-01'
  },
  fragments: {
    analytics: () => Relay.QL`
      fragment on Analytics {
        livingMoneyDashboard(sdate: $sdate, edate: $edate) {
          results{
            date,
            cashBalance{
              currency,
              value
            },
            fundsOnCorrespondentAccountInCB{
              currency,
              value
            },
            fundsOnCorrespondentAccountInOtherBanks{
              state{
                currency,
                value
              },
              nonState{
                currency,
                value
              },
              total{
                currency,
                value
              }
            },
            interbankLending{
              state{
                currency,
                value
              },
              nonState{
                currency,
                value
              },
              total{
                currency,
                value
              }
            },
            restOnSpecialCreditCashOffice{
              currency,
              value
            },
            securities{
              state{
                currency,
                value
              },
              nonState{
                currency,
                value
              },
              total{
                currency,
                value
              }
            },
            total{
              currency,
              value
            }
          }
        }
      }
    `
  }
});