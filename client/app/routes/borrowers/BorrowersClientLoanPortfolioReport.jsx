import React, { Component } from 'react';
import Relay from 'react-relay';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import ArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import Loading from 'components/dumb/Loading.jsx';
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx';
import BasePaper from 'components/layouts/BasePaper/BasePaper.jsx';
import Utils from '../../lib/Utils.js';
import Classnames from 'classnames';
import './BorrowersClientLoanPortfolio.styl';
let u = new Utils();

import { IconButton, Styles, FlatButton, DatePicker, DatePickerDialog } from 'material-ui';

class BorrowersClientLoanPortfolioReport extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showDialog: false,
      openedLoaner: null,
      loading: false,
      stop: false,
      window: {
        innerWidth: window.innerWidth,
      },
      table: {
        height: '50%'
      }
    };
  };

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired,
  };

  componentDidMount() {

    this.setState({
      table:{
        height: ((window.innerHeight - document.getElementsByClassName('block-table')[0].offsetTop)-10 + 'px')
      }
    });

    //console.log( ((window.innerHeight - document.getElementsByClassName('block-table')[0].offsetTop) + 'px') );
  }

  _changePeriod = ()=> {
    this.props.relay.setVariables({
      date: this.state.date,
    }, (e)=> {
      //this.setState({loading: !e.ready});
    });
  }

  _showDialog = (e, captions, data)=> {
    this.setState({openedLoaner: {captions: captions, data: data}, showDialog: true});
    e.stopPropagation();
  }

  _closeDetailsHandler = () => {
    this.setState({showDialog: false});
  }

  _setStartDate = (a, b)=> {
    this.setState({date: u.dts(b)});
  }

  _renderDetail = ()=> {
    let loaner = this.state.openedLoaner;
    let out = loaner.captions.map((el)=> {

      return (
        <div className='line__data'>
          <div className='title'>{el.caption}</div>
          <div className='value'>{loaner.data[el.name]}</div>
        </div>
      );
    });

    return (
      <div className='opened__dialog'>
        {out}
      </div>);
  }

  render() {
    if (!this.props.analytics.borrowersClientLoanPortfolio) return null;
    let tableHeading;
    let tableBody;
    let row;
    let mobileRow;
    let captions = this.props.analytics.borrowersClientLoanPortfolio.captions;
    let results = this.props.analytics.borrowersClientLoanPortfolio.results;

    let style = {
      datePicker: {
        display: 'inline-block',
      },
      filterTitle: {
      },
      table: {},
      tbody: {
        width: (240 + 8 * 2) * (captions.length || 1),
      },
      tmain: {},
      tmain: {
        height: this.state.table.height
      },
      labelStyle: {
        fontSize: '12px',
        color: 'rgba(0,0,0,.54)',
      },
      dropdown: {
        width: '80px',
      },
    };

    captions = captions.sort((a, b)=> {
      return Number(a.nn) - Number(b.nn);
    });

    tableHeading = captions.map((el)=> <div className='block-header__item'>{el.caption}</div>);

    tableBody = results.map((line)=> {
      row = captions.map((el)=> {
        return (
          <div className='block-row__column'>
            <div className='table-cell__header' title={line[el.name]}>
              <div className="table-cell__headername">{line[el.name]}</div>
            </div>
          </div>
        );
      });

      mobileRow = (
        <div className='cell__data' onClick={(e)=>this._showDialog(e, captions, line)}>
          <div className='title'>{line.credit + ' ' + line.agreement} до: {line.issueDate}</div>
          <div className='value'>{u.dm(line.currentDebtRub, 0, '.', ' ', '₽')}</div>
        </div>
      );

      return (
        <div className='block-row'>
          <div className='block-row__column_mobile first'>
            <div className='table-cell__body visible'>
              {mobileRow}
            </div>
          </div>
          {row}
        </div>
      );
    });

    return (
      <BaseStore appBar={{title: 'Кредитный портфель'}}>
        <div className='borrowers_table'>
          <div className='borrower_name'>{results[0].borrower}</div>
          <div className='filter'>
            <div className='filter__store-place'>
              <DatePicker
                maxDate={new Date()}
                style={style.datePicker}
                textFieldStyle={{width: '148px'}}
                hintText='Выберите дату'
                defaultDate={u.std(this.props.relay.variables.date)}
                formatDate={ (date)=> u.dts(date, '/')}
                autoOk={true}
                onChange={this._setStartDate}/>
              <FlatButton secondary={true} label='Применить' onClick={this._changePeriod}/>
            </div>
          </div>

          <div style={style.tmain} className='block-table borrowers__client-loan'>
            <div className='block-header'>
              {tableHeading}
            </div>
            <div className='block-body' style={style.tbody}>
              {tableBody}
            </div>
          </div>
        </div>
        <div className={Classnames({'dialog-paper': true, visible: this.state.showDialog})}>
          <div className='dialog-paper_header'>
            <IconButton className='dialog-paper_close'
                        onClick={this._closeDetailsHandler}><NavigationClose /></IconButton>
            <div className='dialog-paper_title small'>{results[0].borrower}</div>
          </div>
          {this.state.showDialog && this._renderDetail()}
        </div>
      </BaseStore>
    );
  }

}

export default Relay.createContainer(BorrowersClientLoanPortfolioReport, {
  initialVariables: {
    defaultDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    date: '2015-10-01',
    loaner: 13190,
  },
  fragments: {
    analytics: () => Relay.QL`
      fragment on Analytics {
        borrowersClientLoanPortfolio(date: $date, loaner: $loaner) {
          captions {
            name,
            caption,
            nn
          },
          results {
            agreement,
            auto,
            borrower,
            calcReserveSum,
            category,
            clientId,
            credit,
            creditCurrency,
            creditPurpose,
            creditSumCurrency,
            currentDebtCurrency,
            currentDebtRub,
            daysN,
            flat,
            goods,
            guarantees,
            interestRate,
            issueDate,
            lawProp,
            loanAccount,
            nonresident,
            number,
            ogrn,
            papers,
            prolon,
            prop,
            psk,
            qualityCateg,
            rate,
            realReserveSum,
            repaid,
            repayDate,
            reserveForUnusedLimit,
            restor,
            rubCreditSum,
            rubPercent,
            tin,
            unusedLimit
          }
        }
      }
      `,
  },
});
