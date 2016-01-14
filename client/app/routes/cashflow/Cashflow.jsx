import React, { Component } from 'react';
import Relay from 'react-relay';
import Loading from 'components/dumb/Loading.jsx';
import ActionLaunch from 'material-ui/lib/svg-icons/action/launch';
import {Styles, IconButton, FlatButton, DatePicker, DatePickerDialog, DropDownMenu, TextField } from 'material-ui';
let {Typography} = Styles;
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx'
import BasePaper from 'components/layouts/BasePaper/BasePaper.jsx'
import Utils from '../../lib/Utils.js'
import DataParse from '../../lib/DataParse.js';
import CashflowGrid from './CashflowGrid.jsx';
import Suggest from  '../../components/temporary/Suggest/Suggest.jsx'
import './CashFlow.styl';

let utils = new Utils();

class Cashflow extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      loading: false,
      sdate: this.props.relay.variables.sdate,
      edate: this.props.relay.variables.edate,
      type: this.props.relay.variables.type,
      indicators: this.props.relay.variables.indicators,
      ordering: this.props.relay.variables.ordering,
      pageNumber: this.props.relay.variables.pageNumber || 1,
      pageSize: this.props.relay.variables.pageSize || 10,
	    search: this.props.relay.variables.search || null,
	    suggestion: []
//      search: this.props.relay.variables.search || null,
    };
  };

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  componentDidMount() {
  }

  _onOpenCashflowDashboard = ()=> {
    this.context.history.pushState(null, '/cashflow/statistics');
  };


  _changePapams = ()=> {

    this.props.relay.setVariables({
      sdate: this.state.sdate,
      edate: this.state.edate,
      type: this.state.type,
      indicators: this.state.indicators,
      ordering: this.state.ordering,
      pageNumber: this.state.pageNumber,
      pageSize: this.state.pageSize,
      count: this.state.count,
      search: this.state.search,
    }, (e)=> {
      this.setState({loading: !e.ready});
    });
    this._storeState()
  };

  _storeState = ()=> {
    this.state.sdate ? localStorage.setItem('cf_sdate', this.state.sdate) : localStorage.removeItem('cf_sdate');
    this.state.edate ? localStorage.setItem('cf_edate', this.state.edate) : localStorage.removeItem('cf_edate');
    this.state.type ? localStorage.setItem('cf_type', this.state.type) : localStorage.removeItem('cf_type');
    this.state.indicators ? localStorage.setItem('cf_indicators', this.state.indicators) : localStorage.removeItem('cf_indicators');
    this.state.ordering ? localStorage.setItem('cf_ordering', this.state.ordering) : localStorage.removeItem('cf_ordering');
    this.state.pageNumber ? localStorage.setItem('cf_pageNumber', this.state.pageNumber) : localStorage.removeItem('cf_pageNumber');
    this.state.pageSize ? localStorage.setItem('cf_pageSize', this.state.pageSize) : localStorage.removeItem('cf_pageSize');
    this.state.count ? localStorage.setItem('cf_count', this.state.count) : localStorage.removeItem('cf_count');
    this.state.search ? localStorage.setItem('cf_search', this.state.search) : localStorage.removeItem('cf_search');
  };

  _setStartDate = (a, b)=> {
    this.setState({sdate: utils.dts(b)});
  };

  _setEndDate = (a, b)=> {
    this.setState({edate: utils.dts(b)});
  };

  _setEntity = (event, selectedIndex, menuItem)=> {
    this.setState({type: menuItem.payload});
  };

  _setIndicators = (event, selectedIndex, menuItem)=> {
    this.setState({indicators: menuItem.payload});
  };

  _setOrder = (event, selectedIndex, menuItem)=> {
    this.setState({ordering: menuItem.payload});
  };

  _inputKeyDown = (e)=> {
    if (e.key === 'Enter') {
      this.setState({search: e.target.value});
      console.log('enter');
      setTimeout(this._changePapams);
    }
  };

  //_setSearch = (event)=> {
  //  this.setState({search: event.target.value});
  //};

  _renderRightButtons = ()=> {
    return (
      <IconButton onClick={this._onOpenCashflowDashboard}><ActionLaunch /></IconButton>
    );
  };

  _changePage = (page) => {
    this.setState({pageNumber: page});
    setTimeout(this._changePapams);
  };

  _prevPage = ()=> {
    let cfc = this.props.analytics.cashflowClients;
    let curPage = cfc.currentPage;

    if (curPage == 1) return;
    --curPage;

    this._changePage(curPage);
  };

  _nextPage = ()=> {
    let cfc = this.props.analytics.cashflowClients;
    let curPage = cfc.currentPage;

    if (curPage + 1 > cfc.numPages) return;
    ++curPage;

    this._changePage(curPage);
  };

	_setSearch = (val)=> {
		this.setState({search: val});
	};

  _loadSuggest = (v)=>{

    if(v.length >= 2 ){
      this.props.relay.setVariables({
        suggest : v
      });
    } else {
      this.setState({ suggestion: [] });
    }

  };

  render() {

    let cfc = this.props.analytics.cashflowClients;
    let style = {
      filter: {
        minHeight: '124px'
      },
      suggest_box: {
        top:'17px'
      },
      submit: {},
      droplong: {
        position: 'relative',
        display: 'inline-block',
        height: '43px',
        fontSize: '12px',
        width: '180px',
        margin: '0',
        top: '-4px',
        left: '-22px'
      },
      paginatorDropDown: {
        position: 'relative',
        display: 'inline-block',
        height: '39px',
        fontSize: '12px',
        width: '90px',
        margin: '0'
      },
      dropdown: {
        position: 'relative',
        display: 'inline-block',
        height: '44px',
        fontSize: '12px',
        width: '164px',
        margin: '0',
        top: '-4px',
        left: '-22px'
      },
      datePicker: {
        position: 'relative',
        overflow: 'hidden',
        fontSize: '12px',
        display: 'inline-block',
        width: '120px',
        margin: '0'
      },
      filterTitle: {
        color: Typography.textLightBlack,
        fontWeight: Typography.fontWeightNormal
      }
    };
    let paginator;
    let table;
    let entityItems = [
      {payload: 'all', text: 'Все'},
      {payload: 'legal', text: 'Юридические лица'},
      {payload: 'phys', text: 'Физические лица'}
    ];
    let indicators = [
      {payload: 'all', text: 'Все'},
      {payload: 'indicator_1_transit', text: 'Индикатор 1 транзит'},
      {payload: 'indicator_2_transit', text: 'Индикатор 2 транзит'},
      {payload: 'indicator_1_tax', text: 'Индикатор 1 налоги'},
      {payload: 'indicator_1_currency', text: 'Индикатор 1 валюта'}
    ];
    let ordering = [
      {payload: 'all', text: 'без сортировки'},
      {payload: '-cashwithdrawal', text: 'Выдано касса (убыв)'},
      {payload: 'cashwithdrawal', text: 'Выдано касса (возр)'},
      {payload: '-suspiciousness', text: 'Подозрительность (убыв)'},
      {payload: 'suspiciousness', text: 'Подозрительность (возр)'}
    ];
	  let sugestions = this.props.analytics.cashflowTypeahead.results.slice(0, 5);

    paginator = (
      <div className="paginator" style={{textAligin:'right'}}>
        <span className="paginator__pages-title">&nbsp;{cfc.currentPage}&nbsp;из&nbsp;{cfc.numPages}&nbsp;</span>
        <i className="material-icons" onClick={this._prevPage}>keyboard_arrow_left</i>
        <i className="material-icons" onClick={this._nextPage}>keyboard_arrow_right</i>
      </div>
    );

    if (this.state.loading) {
      table = (<Loading />);
    } else {
      table = (
        <div>
          <CashflowGrid data={this.props.analytics}/>
          { paginator }
        </div>
      );
    }

    return (
      <BaseStore appBar={{title: "Денежные потоки",iconElementRight:this._renderRightButtons()}}>
        <div className="borrowers_table filters">
          <div className='' style={style.filter}>
            <h2 className='filter__title' style={style.filterTitle}>Фильтр</h2>
            <div className="filter_selectors">
		          <span>
			          <div>Дата начала:</div>
			          <DatePicker style={style.datePicker} maxDate={new Date()} className="cs_filter"
                            defaultDate={ utils.std(this.state.sdate) }
                            formatDate={ (date)=>{return utils.dts(date,'/')} }
                            hintText="дата начала" autoOk={true} showYearSelector={true} onChange={this._setStartDate}/>
		          </span>
		          <span>
			          <div>Дата конца:</div>
			          <DatePicker style={style.datePicker} maxDate={new Date()} defaultDate={utils.std(this.state.edate)}
                            formatDate={ (date)=>{return utils.dts(date,'/')} }
                            hintText="дата конца" autoOk={true} showYearSelector={true} onChange={this._setEndDate}/>
		          </span>
		          <span>
				        <div className="filterheadings_long">Тип:</div>
			          <DropDownMenu style={style.dropdown} menuItems={entityItems} onChange={this._setEntity}
                              selectedIndex={ ~entityItems.indexOf( entityItems.filter((a)=>{ return this.state.type == a.payload})[0] )?entityItems.indexOf( entityItems.filter((a)=>{ return this.state.type == a.payload})[0] ):0 }/>
		          </span>
							<span>
								<div className="filterheadings_longer">Идентификатор:</div>
			          <DropDownMenu style={style.droplong} menuItems={indicators} onChange={this._setIndicators}
                              selectedIndex={~indicators.indexOf( indicators.filter((a)=>{ return this.state.indicators == a.payload})[0] ) ? indicators.indexOf( indicators.filter((a)=>{ return this.state.indicators == a.payload})[0] ) : 0}/>
							</span>
		          <span>
			          <div className="filterheadings_longer">Сортировать по:</div>
			          <DropDownMenu style={style.droplong} menuItems={ordering} onChange={this._setOrder}
                              selectedIndex={~ordering.indexOf( ordering.filter((a)=>{ return this.state.ordering == a.payload})[0] ) ? ordering.indexOf( ordering.filter((a)=>{ return this.state.ordering == a.payload})[0] ) : 0}/>
		          </span>
		          <span>
			          <div className="filterheadings_longer">Поиск:</div>
                <Suggest style={style.suggest_box} listIems={sugestions} loadSuggest={this._loadSuggest} onChange={this._setSearch} value={+(localStorage.getItem('cf_search')) || null} />
		          </span>
		          <span>
			          <FlatButton secondary={true} label="Применить" onClick={this._changePapams} style={style.submit}/>
		          </span>
            </div>
          </div>
          {table}
        </div>
      </BaseStore>
    );
  }
}
export default Relay.createContainer(Cashflow, {
  initialVariables: {
    rowState: [],
    suggest:'<',
    sdate: localStorage.getItem('cf_sdate') || utils.dts(new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1)),
    edate: localStorage.getItem('cf_edate') || utils.dts(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
    type: localStorage.getItem('cf_type') || null,
    indicators: localStorage.getItem('cf_indicators') || null,
    ordering: localStorage.getItem('cf_ordering') || null,
    pageNumber: +(localStorage.getItem('cf_pageNumber')) || 1,
    pageSize: +(localStorage.getItem('cf_pageSize')) || 20,
    count: +(localStorage.getItem('cf_count')) || null,
    search: +(localStorage.getItem('cf_search')) || null
  },
  prepareVariables: prevVariables => {
    let sdate = localStorage.getItem('cf_sdate');
    let edate = localStorage.getItem('cf_edate');

    if ((sdate && sdate != prevVariables.sdate)) {          //TODO: fix relay routes variables
      prevVariables.sdate = sdate;
    }
    if ((edate && edate != prevVariables.edate)) {
      prevVariables.edate = edate;
    }

    return {
      ...prevVariables
    };
  },
  fragments: {
    analytics: () => Relay.QL`
      fragment on Analytics {
        cashflowTypeahead (search: $suggest) {
          results
        },
        cashflowClients(type: $type, sdate: $sdate, edate: $edate, pageNumber: $pageNumber, pageSize: $pageSize, indicators: $indicators, ordering: $ordering, search: $search) {
          totalItems,
          numPages,
          currentPage,
          pageSize,
          results {
            cash {
              blockTitle,
              blockContent {
                fields {
                  fieldName,
                  renderable,
                  type,
                  value {
                    currency
                    percent
                    label
                    description
                    value
                  },
                  verboseName
                },
                indicators {
                  block,
                  color,
                  helpText,
                  icon,
                  name,
                  title
                }
              }
            },
            client {
              blockTitle,
              blockContent {
                fields {
                  fieldName,
                  renderable,
                  type,
                  value {
                    currency
                    percent
                    label
                    description
                    value
                  },
                  verboseName
                },
                indicators {
                  block,
                  color,
                  helpText,
                  icon,
                  name,
                  title
                }
              }
            },
            clientId,
            currency {
              blockTitle,
              blockContent {
                fields {
                  fieldName,
                  renderable,
                  type,
                  value {
                    currency
                    percent
                    label
                    description
                    value
                  },
                  verboseName
                },
                indicators {
                  block,
                  color,
                  helpText,
                  icon,
                  name,
                  title
                }
              }
            },
            loans {
              blockTitle,
              blockContent {
                fields {
                  fieldName,
                  renderable,
                  type,
                  value {
                    currency
                    percent
                    label
                    description
                    value
                  },
                  verboseName
                },
                indicators {
                  block,
                  color,
                  helpText,
                  icon,
                  name,
                  title
                }
              }
            },
            tax {
              blockTitle,
              blockContent {
                fields {
                  fieldName,
                  renderable,
                  type,
                  value {
                    currency
                    percent
                    label
                    description
                    value
                  },
                  verboseName
                },
                indicators {
                  block,
                  color,
                  helpText,
                  icon,
                  name,
                  title
                }
              }
            },
            transit {
              blockTitle,
              blockContent {
                fields {
                  fieldName,
                  renderable,
                  type,
                  value {
                    currency
                    percent
                    label
                    description
                    value
                  },
                  verboseName
                },
                indicators {
                  block,
                  color,
                  helpText,
                  icon,
                  name,
                  title
                }
              }
            }
          }
        }
      }
    `
  }
});