import React, { Component } from 'react';
import Relay from 'react-relay';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import ArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import Loading from 'components/dumb/Loading.jsx';
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx'
import BasePaper from 'components/layouts/BasePaper/BasePaper.jsx'
import Utils from '../../lib/Utils.js'
import Classnames from 'classnames';
import './BorrowersClientLoanPortfolio.styl'
let utils = new Utils();

import { IconButton, Styles, FlatButton, DatePicker, DatePickerDialog } from 'material-ui';

class BorrowersClientSaldoReport extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showDialog : false,
      openedLoaner: null,
      loading: false,
      window: {
        innerWidth: window.innerWidth
      },
      tableHeight: '50%'
    };
  };

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    this.setState({ tableHeight: ((window.innerHeight - document.getElementsByClassName('block-body')[0].offsetTop )-20 + 'px') });

    window.onscroll = () => {
      if (!this.state.loading && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {

        this.setState({loading: true}, () => {
          this.props.relay.setVariables({
            //pageNumber: this.props.relay.variables.pageNumber + 1
            pageSize: this.props.relay.variables.pageSize + this.props.relay.variables.count
          }, (readyState) => { // this gets called twice https://goo.gl/ZsQ3Dy
            if (readyState.done) {
              this.setState({loading: false});

            }
          });
        });

      }
    }
  }

  _showDialog=(e, captions, data)=>{
    this.setState({openedLoaner: {captions:captions, data:data }, showDialog: true });
    e.stopPropagation();
  };

  _closeDetailsHandler = () => {
    this.setState({showDialog:false});
  };


  _changePeriod = ()=> {
    this.props.relay.setVariables({
      date: this.state.date,
    }, (e)=> {
      //this.setState({loading: !e.ready});
    });
  };

  _setStartDate = (a, b)=> {
    this.setState({date: utils.dts(b)});
  };

  _renderDetail=()=>{
    let loaner = this.state.openedLoaner;
    let out = loaner.captions.map((el)=>{

      return(
        <div className="line__data">
          <div className="title">{el.caption}</div>
          <div className="value">{loaner.data[el.name]}</div>
        </div>
      )
    });

    return(<div className="opened__dialog">
      {out}
    </div>)
  };

  render() {

    if (!this.props.analytics.borrowersClientSaldo) return null;

    let tableHeading, tableBody, row, mobile_row,
      captions = this.props.analytics.borrowersClientSaldo.captions,
      values = this.props.analytics.borrowersClientSaldo.results;

    captions = captions.sort((a, b)=> {
      return Number(a.nn) - Number(b.nn);
    });
    tableHeading = captions.map((el)=> {
      return (<div className="block-header__item">{el.caption}</div>)
    });

    tableBody = values.map((line)=> {

      row = captions.map((el)=> {
        return (
          <div className="block-row__column">
            <div className="table-cell__header" style={{'cursor':'auto'}}>
              {line[el.name]}
            </div>
          </div>
        );
      });

      mobile_row = (
        <div className="cell__data" onClick={(e)=>{ this._showDialog(e, captions, line )} }>
          <div className="title">{line.orgName}</div>
          <div className="value">{utils.dm(line.saldoTurn, 0, '.', ' ', '₽')}</div>
        </div>
      );

      return (
        <div className="block-row">
          <div className="block-row__column_mobile first">
            <div className="table-cell__body visible">
              {mobile_row}
            </div>
          </div>
          {row}
        </div>
      );
    });

    let style = {
      datePicker: {
        display: 'inline-block'
      },
      filterTitle: {
//        color: Typography.textLightBlack,
//        fontWeight: Typography.fontWeightNormal
      },
      table: {width: 'auto'},
      tbody: {
        height: this.state.tableHeight,
        width: 9 * (240+16) + 320 + 16
      },
      tmain: {
        //overflowX: 'inherit'
        //width: window.innerWidth - 48
      },
      labelStyle: {
        fontSize: '12px',
        color: 'rgba(0,0,0,.54)'
      },
      dropdown: {
        width: '80px'
      }
    };
    return (
      <BaseStore appBar={{title: "Кредитный портфель"}}>
        <div className="borrowers_table">
          <div className='filter'>
            <div className="filter__store">
              <h2 className='filter__title' style={style.filterTitle}>Фильтр</h2>
            </div>
            <div className="filter__store">
              <DatePicker
                style={style.datePicker}
                textFieldStyle={{width: '148px'}}
                maxDate={new Date()}
                hintText="Выберите дату"
                defaultDate={utils.std(this.props.relay.variables.date)}
                formatDate={ (date)=>{return utils.dts(date,'/')} }
                autoOk={true}
                onChange={this._setStartDate}/>
              <FlatButton secondary={true} label="Применить" onClick={this._changePeriod}/>
            </div>
          </div>
          <div style={style.tmain} className='block-table borrowers__client-loan'>
            <div className="block-header">
              {tableHeading}
            </div>
            <div className="block-body" style={style.tbody}>
              {tableBody}
            </div>
          </div>
          <div className={Classnames({'dialog-paper': true, 'visible': this.state.showDialog})}>
            <div className="dialog-paper_header">
              <IconButton className="dialog-paper_close" onClick={this._closeDetailsHandler}><NavigationClose /></IconButton>
              <div className="dialog-paper_title small">{values[0]?values[0].orgName:''}</div>
            </div>
            {this.state.showDialog && this._renderDetail()}
          </div>
        </div>
      </BaseStore>
    )

  }
}

export default Relay.createContainer(BorrowersClientSaldoReport, {
  initialVariables: {
    defaultDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    date: '2015-10-01',
    loaner: 13190,
    pageNumber: 1,
    pageSize: 20,
    count: 100
  },
  fragments: {
    analytics: () => Relay.QL`
      fragment on Analytics {
        borrowersClientSaldo(date: $date, loaner: $loaner) {
          captions {
            name,
            caption,
            nn
          },
          results {
            billN,
            clientId,
            counter,
            creditTurn,
            dateEnd,
            dateStart,
            debetTurn,
            orgName,
            saldoTurn
          }
        },
      }
    `,
  },
});
