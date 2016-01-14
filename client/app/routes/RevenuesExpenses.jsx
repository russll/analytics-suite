import React, { Component } from 'react';
import Relay from 'react-relay';
import BasePaper from 'components/layouts/BasePaper/BasePaper.jsx'
import TreeGrid from '../components/temporary/TreeGrid/TreeGrid.jsx';
import BarChart from '../components/temporary/Charts/BarChart.jsx'
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import ArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import Loading from '../components/dumb/Loading.jsx';
import { Styles, FlatButton, DatePicker, DropDownMenu, Dialog, AppBar, Card, IconMenu, IconButton, CardTitle, MenuItem,Table, TableHeader, TableRow,TableBody,TableRowColumn,TableFooter, TableHeaderColumn } from 'material-ui';
let { Colors, } = Styles;
import DataParse from '../lib/DataParse.js';
import Utils from '../lib/Utils';
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx'

import './RevenuesExpenses.styl'

let dp = new DataParse();
let utils = new Utils();


class RevenuesExpenses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      graphName: '',
      redrawTable: true,
      dateToShow: '01-08-2015',
      headerSticked:false

    }
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };


  componentDidMount() {
    window.addEventListener('scroll', this._scrollHandler);

    //this._renderChart();

    let results = this.props.analytics.revenuesExpensesDashboard.results;

    let dateStart = results[0].datestamp;
    let dateEnd = results[results.length - 1].datestamp;

    this.setState({
      dateStart: new Date(dateStart.split('-')[0], dateStart.split('-')[1]-1, dateStart.split('-')[2]),
      dateEnd: new Date(dateEnd.split('-')[0], dateEnd.split('-')[1]-1, dateEnd.split('-')[2])
    });

  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._scrollHandler);
  }

  shouldComponentUpdate(newProps, newSate){
    return this.state.headerSticked == newSate.headerSticked;
  }

  _scrollHandler = () =>{
    let thead = document.getElementsByClassName('tab-header')[0];
    let tgreed = document.getElementsByClassName('treegrid')[0];
    let tgreedTop = tgreed.getBoundingClientRect().top;

    if(tgreedTop<0){
      thead.classList.add("tab-header_sticked");
      if(!this.state.headerSticked){  this.setState({headerSticked:true}); }
    } else {
      thead.classList.remove("tab-header_sticked");
      if(this.state.headerSticked){ this.setState({headerSticked:false}); }
    }
  };

  _changeDate = ((e, s, m)=> {
    this.setState({dateToShow: m.date});
  });

  _changePeriod = ()=> {

    this.props.relay.setVariables({
      sdate: utils.dts(this.state.dateStart),
      edate: utils.dts(this.state.dateEnd)
    }, (e)=> {
      this.setState({loading: !e.ready});
    });
  };

  _setStartDate = (a, b)=> {
    this.setState({dateStart: b});
  };

  _setEndDate = (a, b)=> {
    this.setState({dateEnd: b});
  };

  _formatDate = (date)=> {
    return utils.dts(date,'/');
  };

  render() {

    let grid, dte = '', groups,
      menuItems = [], dropDown = '',
      groupsIn = '',
      normalized = '',
      dataForBar = [];

    if (this.props.analytics.revenuesExpensesDashboard) {
      groupsIn = dp.getBorrowersGroups(this.props.analytics.revenuesExpensesDashboard.results);
      normalized = dp.RevenueExpensesScoreTableData(this.props.analytics.revenuesExpensesDashboard.results);
      dataForBar = this.props.analytics.revenuesExpensesDashboard.results.map((item)=> {
        for (let i = 0; i < item.data.length; i++) {
          if ('ИТОГО финансовый результат' == item.data[i].name) {
            return {
              date: utils.dc(item.datestamp,2),
              value: parseInt(item.data[i].money)/1000000
            };
          }
        }
        return {};
      });
    }

    let style = {
      groupTable: {
//          border: "1px solid #ccc"
        },
        td: {
          padding: "0",
          textAlign:"center",
          minWidth:"100px"

        },
        datePicker: {
          display: "inline-block",
          width: "150px!important",
          overflow: "hidden",
          padding: "0px 0px 0 20px"
        }
      },

      baroptions2 = {
        scaleShowVerticalLines: false,
        scaleBeginAtZero: false,
        barBeginAtOrigin: true,
        responsive: true,
        scaleLabel: "<%=Math.round(value/1000)%>",
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= Number(value) %>"
//	        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= Number(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')  %>"
      };

    let width = window.innerWidth - ( window.innerWidth > (536 + 48) ? (420 + 96) : 0 ) - 48;

    if (groupsIn.length) {

      groups = groupsIn.map((el) => {
        let elDate = utils.dc(el.date, 3);
        menuItems.push({date: elDate, text: elDate});

        if (this.state.dateToShow != elDate) {
          return;
        } else {
          dte = elDate;

          let elGroups = el.groups.slice();
          elGroups.sort((a, b) => {
            return a.group_number - b.group_number
          });

          let headColumns = elGroups.map((e) => {
            //return ( <TableHeaderColumn style={style.td}>Группа {e.group_number}</TableHeaderColumn> );
            return ( <TableHeaderColumn style={style.td}>Группа {e.group_number}</TableHeaderColumn> );
          });

          let bodyColumns = elGroups.map((e) => {
            return (
              <TableRowColumn
                style={style.td}>{ (utils.dm(e.credit_total/1000)) }</TableRowColumn> );
          });
          return (
            <div style={style.groupTable}>
              <Table>
                <TableHeader >
                  <TableRow hoverable="true">
                    <TableRowColumn style={{width:"10px", padding:"10px"}}> </TableRowColumn>
                    {headColumns}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow selected={false}>
                    <TableRowColumn style={{width:"10px", padding:"10px"}}> </TableRowColumn>
                    {bodyColumns}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          );
        }
      });
      groups = groups.filter(x => !!x);

    }

    if (menuItems.length) {
      dropDown = (<DropDownMenu
        style={{position:"relative", bottom:"-12px"}}
        menuItems={menuItems} onChange={this._changeDate}/>);
    }

    if (normalized.length) {    // if any data arrived.
      if (this.state.loading) {
        grid = (<div style={{padding:"150px 0 450px 0"}}><Loading/></div>);
      } else {
        grid = (<TreeGrid className="tree-grid__revenues-expenses" showHead='true' showDetails='false' data={ normalized } use='GridLine' showDialog={true}
                          moduleName="RevenuesExpenses"/> );
      }
    } else {
      groups = (<Loading />);
      grid = (<Loading />);
    }

    let dateFrom = (
      <DatePicker style={style.datePicker} hintText="дата начала" formatDate={this._formatDate} autoOk={true}
                  value={ this.state.dateStart } onChange={this._setStartDate}/>);
    let dateTo = (
      <DatePicker style={style.datePicker} hintText="дата конца" formatDate={this._formatDate} autoOk={true}
                  value={ this.state.dateEnd } onChange={this._setEndDate}/>);

    return (
      <BaseStore appBar={{title: "Доходы/Расходы, тыс. руб.", big:false}}>
        <div>

          <h2>Финансовый результат, млн. ₽</h2>
          <div>
            <BarChart data={dataForBar} maxWidth={800} height={400} yTickFormat="g"/>
            {/*<svg ref="revenuesExpensesBarChart" className="revenues-expenses-bar-chart"/>*/}

          </div>
          <br/><br/><br/>
          <h2 onClick={this._showDialog}>Срез по месяцам</h2>
          <div style={{display:"inline-block", position:"relative", top:"15px"}}>
            {dateFrom}{dateTo}
            <FlatButton
              style={{position:"relative", bottom:"15px", margin:"5px"}}
              secondary={true} label="Показать" onClick={this._changePeriod}/>
          </div>
          {grid}

          <h2>Процентные доходы по категориям заемщиков,  за </h2>
          <div style={{display:"inline-block"}}>{dropDown}</div>
          <div style={{overflowX:"scroll", marginBottom:"30px"}}>
            <div style={{minWidth:"600px",overflow:"visible"}}>
              {groups}
            </div>
          </div>
        </div>
      </BaseStore>
    );
  }
}

export default Relay.createContainer(RevenuesExpenses, {
  initialVariables: {
    sdate: '',
    edate: ''
  },
  fragments: {
    analytics: () => Relay.QL`
      fragment on Analytics {
        revenuesExpensesDashboard(sdate: $sdate, edate: $edate) {
          results{
            datestamp,
            groups{
              credit_total,
              group_number,
              type
            },
            data{
              money,
              name,
              nesting,
              type
            }
          }
        }
      }
    `
  }
});