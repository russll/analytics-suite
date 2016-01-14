import React, { Component } from 'react';
import Relay from 'react-relay';
import Tile from '../components/temporary/Tile/Tile.jsx'
import { Paper, FontIcon, Styles } from 'material-ui';
let { Colors, ThemeManager } = Styles;
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx'
import Theme from 'styles/theme';
import basConfig from '../../../data/bas.config.json';
import BarChartMono from 'components/temporary/Charts/BarChartMono.jsx'
import DataParse from '../lib/DataParse.js';
import Utils from '../lib/Utils.js'

let dp = new DataParse();
let u =  new Utils();

class Home extends Component {
  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(Theme)
    };
  };

  componentDidMount() {
    if(!this.props.analytics.basDashboard.cashflow) return;
    this._cleanStorage();
  }

  _cleanStorage=()=>{
    localStorage.removeItem('cf_sdate');
    localStorage.removeItem('cf_edate');
    localStorage.removeItem('cf_type');
    localStorage.removeItem('cf_indicators');
    localStorage.removeItem('cf_ordering');
    localStorage.removeItem('cf_pageNumber');
    localStorage.removeItem('cf_pageSize');
    localStorage.removeItem('cf_count');
  };

  render() {
    let livingMon = dp.cashFlowDashboardChart( this.props.analytics.basDashboard.livingmoney );
    let incomeExp = this.props.analytics.basDashboard.incomeexpenses;
    let cashData = incomeExp.dates.map( (el, idx)=> {
      return  { date:el.split('-')[1], value: Number(incomeExp.values[idx]) }
    });

    let liveData = livingMon.labels.map( (el, idx)=> {
      return  { date:el, value: Number(livingMon.datasets[0].data[idx] ) }
    });

    let theme = this.context.muiTheme.rawTheme;
    let style = {
      wrapper: {
        padding: '0 20px'
      },
      tileContentWrapperTop: {
        position: 'absolute',
        top: '20px',
        left: '24px',
        color: theme.palette.alternateTextColor,
        fontSize: '14px',
        fontWeight: 100,
        width: '100%'
      },
      tileContentWrapper: {
        position: 'absolute',
        top: '64px',
        left: '24px',
        color: theme.palette.alternateTextColor,
        fontSize: '14px',
        fontWeight: 100,
        width: '100%'
      },
      tileContent: {
        width: '208px',
        height: '24px'
      },
      tileRightMarkerWrapper: {
        color: theme.palette.alternateTextColor,
        fontSize: '14px'
      },
      tileLeftMarkerWrapper: {
        color: theme.palette.alternateTextColor,
        fontSize: '14px'
      },
      leftCaps: {
        fonSize: '16px',
        fontWeight: '400'
      },
      trendDown: {
        position: 'relative',
        top: '6px'
      },
      left: {
        float: 'left'
      },
      right: {
        float: 'right'
      },
      iconWrapper: {
        padding: '0px 12px',
        display: 'inline-block'
      },
      alRight: {
        textAlign: 'right'
      },
      iconText: {
        fontSize: '24px',
        verticalAlign: 'top'
      },
      lmChart:{
        width: '200px',
        height: '90px',
        position: 'absolute',
        left:'20px',
        top:'50px'
      },
      lmDate:{
        color: "#fff",
        fontSize:'14px',
        margin:'20px'
      },
      lmValue:{
        float:'right'
      }
    };

    let lmd = this.props.analytics.basDashboard.livingmoney.dates;
    let lmv = this.props.analytics.basDashboard.livingmoney.values;

    let lmDate = u.dsn(lmd[lmd.length-1]);
    let lmSumm = u.dm(lmv[lmv.length-1]/1000);

    let cfd = this.props.analytics.basDashboard.incomeexpenses.dates;
    let cfv = this.props.analytics.basDashboard.incomeexpenses.values;
    let cashFlowDate = u.dsn(cfd[cfd.length-1]);
    let cashFlowSumm = u.dm(cfv[cfv.length-1]/1000);

    return (
      <BaseStore appBar={{title: "Bank Analytics Service"}}>
        <div>
          <Tile
            title={basConfig.borrowers}
            route='/borrowers'
            leftMarker={<div style={style.tileLeftMarkerWrapper}><span>Задолженность на текущий момент</span></div>}
            icon='icon-agreement'>
            <div style={style.tileContentWrapper}>
              <div style={style.tileContent}>
                <span style={style.left}>Общая</span>
                <span style={style.right}>
                  {u.dm(Math.round(this.props.analytics.basDashboard.loaners.generalInformation.debt.value/10000)/100)} млн. ₽
                </span>
              </div>
              <div style={style.tileContent}>
                <span style={style.left}>Просроченная</span>
                <span style={style.right}>
                  {u.dm(Math.round(this.props.analytics.basDashboard.loaners.generalInformation.delinquency.value/10000)/100)} млн. ₽
                </span>
              </div>
            </div>
          </Tile>

          <Tile
            title={basConfig.cashflow}
            route={'/cashflow'} //?sdate='+ u.dts( new Date(new Date().getFullYear(), 0, 1) ) +'&edate='+ u.dts(new Date(new Date().getFullYear(), new Date().getMonth(), 1))+ '&type=all'}
            type='Папка'
            icon='folder'
            leftMarker={<div style={style.tileLeftMarkerWrapper}><div style={style.alRight}>Оборот на текущий момент, всего</div></div>}
            icon='icon-ascending24'>
            <div style={style.tileContentWrapper}>
              <div style={style.tileContent}>
                <span style={style.left}>Дебет</span>
                <span
                  style={style.right}>{u.dm(Math.round(this.props.analytics.basDashboard.cashflow.turnover.debit.total.value/10000)/100)} млн. ₽</span>
              </div>
              <div style={style.tileContent}>
                <span style={style.left}>Кредит</span>
                <span
                  style={style.right}>{u.dm(Math.round(this.props.analytics.basDashboard.cashflow.turnover.credit.total.value/10000)/100)} млн. ₽</span>
              </div>
            </div>
          </Tile>

          <Tile title={basConfig.assets} route='/non-balance-assets' type='Папка' icon='icon-verification5'
                style={{backgroundColor: Colors.cyan500}}>
            <div style={style.tileContentWrapperTop}>
              <div style={style.tileContent}>
                <span style={style.left}>Низкого качества</span>
                <span style={style.right}>{u.dm(this.props.analytics.basDashboard.offbalancedassets.summary.bad.value)} ₽</span>
              </div>
              <div style={style.tileContent}>
                <span style={style.left}>Вероятен возврат</span>
                <span style={style.right}>{u.dm(this.props.analytics.basDashboard.offbalancedassets.summary.good.value)} ₽</span>
              </div>
            </div>
          </Tile>

          <Tile title={basConfig.revenuesExpenses} route='/revenues-expenses' type='Папка' icon='icon-seo15'
                style={{backgroundColor: Colors.cyan500}}
                rightMarker={<div style={style.tileRightMarkerWrapper}><span style={style.iconText}><br/></span><div style={style.iconWrapper}>
	            </div></div>}>
            <div style={style.lmChart}>
              <BarChartMono chartUnicName="chart1" data={cashData} maxWidth={150} height={100} yTickFormat="d"  />
            </div>
            <div style={style.lmDate}>Итого на {cashFlowDate}<span style={style.lmValue}>{cashFlowSumm} тыс. ₽</span></div>

          </Tile>

          <Tile title='Ликвидные средства' route='/money' type='Папка' style={{backgroundColor: Colors.cyan500}}
                leftMarker={<div style={style.tileLeftMarkerWrapper}></div>}
                rightMarker={<div style={style.tileRightMarkerWrapper}></div>}
                icon='icon-finance-and-business4'>
            <div style={style.lmChart}>
              <BarChartMono chartUnicName="chart2" data={liveData} maxWidth={150} height={100} />
            </div>
            <div style={style.lmDate}>Итого на {u.dsn(lmDate)}<span style={style.lmValue}>{lmSumm} тыс. ₽</span></div>
          </Tile>
        </div>
      </BaseStore>
    );
  }
}

export default Relay.createContainer(Home, {
  //initialVariables: {
  //  edate: u.dc( new Date() ),
  //  sdate: u.dc( new Date(new Date().setMonth((new Date()).getMonth() -6)) )
  //},
  fragments: {
    analytics: () => Relay.QL`
      fragment on Analytics {
        basDashboard{
          cashflow{
            turnover{
              debit{
                total{
                  currency
                  value
                }
              }
              credit{
                total{
                  currency
                  value
                }
              }
            }
          }
          incomeexpenses{
            dates,
            values
          }
          livingmoney{
            dates,
            values
          }
          loaners{
            date,
            generalInformation{
              debt{
                currency
                value
              }
              delinquency{
                currency
                value
                percent
              }
            }
          }
          offbalancedassets{
            summary{
              bad{
                currency
                value
              }
              good{
               currency
                value
              }
            }
          }
        }

      },

    `
  }
});
