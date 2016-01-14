import React, { Component } from 'react';
import Relay from 'react-relay';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import HistIcon from 'material-ui/lib/svg-icons/action/history'; //description
import Agreement from 'material-ui/lib/svg-icons/image/filter-none'; //description
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import { Toggle, Styles, DatePicker, FlatButton, DropDownMenu, TextField, Checkbox, ToggleStar } from 'material-ui';
import Loading from 'components/dumb/Loading.jsx';
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx'
import BasePaper from 'components/layouts/BasePaper/BasePaper.jsx'
import Utils from '../../lib/Utils.js'
import Suggest from  '../../components/temporary/Suggest/Suggest.jsx'
let utils = new Utils();


class BorrowersReport extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      loading: false,
      date: this.props.location.query.date||utils.dts(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      group: this.props.location.query.group,
      entity: this.props.location.query.entity,
      pagesize: this.props.location.query.pagesize,
      pagenumber: this.props.location.query.pagenumber,
      indicatorsDisabled : true,
      search: null,
      suggestion: []
    };
  };

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !(
    nextState.search != this.state.search ||
    nextState.date != this.state.date ||
    nextState.group != this.state.group ||
    nextState.suggestion != this.state.suggestion ||
    nextState.entity != this.state.entity);
  }
// queryParams={['date', 'group', 'entity', 'pagesize', 'pagenumber']}
  _changePeriod = ()=> {

    let indicators = [ 1, 2, 3, 4 ].map((num)=>{
      if(this.refs['indicator'+num].isChecked()) return num;
    });

    if(!this.state.indicatorsDisabled) {                      // enabled
      indicators = indicators.filter(n=> n?n:false).join(',');
      indicators = indicators.length?indicators:'blank'
    } else {
      indicators ='';
    }

// blank
    this.context.history.replaceState(null, utils.cPath('/borrowers/borrowers-report?',{
        date: this.state.date,
        group: this.state.group,
        entity: this.state.entity,
        pagesize: this.state.pagesize,
        pagenumber: this.state.pagenumber,
        search: this.state.search,
        indicators: indicators
      })
    );
  };

  _setStartDate = (a, b)=> {
    this.setState({date: utils.dts(b)});
  };

  _setEntity = (event, selectedIndex, menuItem)=> {
    this.setState({entity: menuItem.payload});
  };

  _setCategory = (event, selectedIndex, menuItem)=> {
    this.setState({group: menuItem.payload});
  };

  _setSearch = (val)=> {
    this.setState({search: val});
  };

  _loadSuggest = (v)=>{

    if(v.length >= 2 ){
      this.props.relay.setVariables({
        group : this.props.location.query.group,
        search : v
      });
    } else {
      this.setState({ suggestion: [] });
    }

  };

  _toggleIndicators = ()=>{
    this.setState({indicatorsDisabled: !this.refs.toggle.isToggled()});
  };

  render() {
    let style={
      picker: {
        display: 'inline-block',
        verticalAlign:'top',
        textAlign:'left'
      },
      button:{
        display: 'block',
        margin:'20px 0'
      },
      suggest:{
        marginRight: '20px'
      },
      toggle:{
        margin: '0 0 20px 0'
      },
      checkbox:{
        display: 'inline-block',
        width:'auto',
        whiteSpace:'nowrap',
        marginRight:'40px'
      },
      checkboxDisabled:{
        opacity: 0.3,
        display: 'inline-block',
        width:'auto',
        whiteSpace:'nowrap',
        marginRight:'40px'
      }
    };
    let entityItems = [
      {payload: 'all', text: 'Все'},
      {payload: 'legal', text: 'Юридические лица'},
      {payload: 'physical', text: 'Физические лица'}
    ];

    let categoryItems = [1, 2, 3, 4, 5, 6, 'all'].map((i) => {
      return {
        payload: i.toString(),
        text: i == 'all' ? 'Все' : 'Категория ' + i
      }
    });
    let sugestions = this.props.analytics?this.props.analytics.borrowersTypeahead.results.slice(0, 5):[];
    //console.log('State', this.state);
    //console.log('Props', this.props);

    return (
      <BaseStore appBar={{title: "Кредитный портфель", big: false}}>
        <div className="borrowers_table">
          <div className='filter' style={style.filter}>
            <div className="filter__store">
              <h2 className='filter__title'>Фильтр</h2>
            </div>

            <div className="filter__store" style={style.filter}>
              <DatePicker
                maxDate={new Date()}
                style={style.picker}
                textFieldStyle={{width: '148px'}}
                hintText="Выберите дату"
                defaultDate={utils.std(this.state.date)}
                formatDate={ (date)=>{return utils.dts(date,'/')} }
                autoOk={true}
                onChange={this._setStartDate} />

              <DropDownMenu
                style={{top: '-8px', width: '200px', textAlign:'left'}}
                selectedIndex={ categoryItems.indexOf(categoryItems.filter((el)=>{ if(el.payload == (this.state.group||'all') ) return true })[0] ) }
                menuItems={categoryItems}
                onChange={this._setCategory} />

              <DropDownMenu
                style={{top: '-8px', width: '200px', textAlign:'left'}}
                selectedIndex={ entityItems.indexOf(entityItems.filter((el)=>{if(el.payload == (this.state.entity||"all")) return true})[0]) }
                menuItems={entityItems}
                onChange={this._setEntity} />

              <span style={style.suggest}>
                <Suggest listIems={sugestions} loadSuggest={this._loadSuggest} onChange={this._setSearch} value={this.props.location.query.search} />
		          </span>

              <div className="filters">
                <Toggle ref="toggle" onToggle={this._toggleIndicators} name="toggle_ind" value="indicators" label="Фильтровать по индикаторам" labelPosition="right" style={style.toggle}/>
                <div className={this.state.indicatorsDisabled?'hide':''}>
                  <div className="indi_switches">
                    <Checkbox ref="indicator1" disabled={this.state.indicatorsDisabled} name="indicator1" value="1" label="Индикатор 1" defaultChecked={true}
                              iconStyle={{fill:'#FFB83D'}} labelStyle={{color:'#FFB83D'}}
                              style={this.state.indicatorsDisabled?style.checkboxDisabled:style.checkbox} />

                    <Checkbox ref="indicator2" disabled={this.state.indicatorsDisabled} name="indicator2" value="2" label="Индикатор 2" defaultChecked={true}
                              iconStyle={{fill:'#4F58DA'}} labelStyle={{color:'#4F58DA'}}
                              style={this.state.indicatorsDisabled?style.checkboxDisabled:style.checkbox} />

                    <Checkbox ref="indicator3" disabled={this.state.indicatorsDisabled} name="indicator3" value="3" label="Индикатор 3" defaultChecked={true}
                              iconStyle={{fill:'#1eb152'}} labelStyle={{color:'#1eb152'}}
                              style={this.state.indicatorsDisabled?style.checkboxDisabled:style.checkbox} />

                    <Checkbox ref="indicator4" disabled={this.state.indicatorsDisabled} name="indicator3" value="4" label="Индикатор 4" defaultChecked={true}
                              iconStyle={{fill:'#1ebccc'}} labelStyle={{color:'#1ebccc'}}
                              style={this.state.indicatorsDisabled?style.checkboxDisabled:style.checkbox} />

                  </div>
                  <div className="indi_descr">
                    <span>Индикаторы:</span>
                    <ol className="indicators_list">
                      <li className="ind_1">налоговые платежи меньше 0,5% от оборота</li>
                      <li className="ind_2">приход и уход денежных средств "день в день"</li>
                      <li className="ind_3">большие обороты при низких среднехронологических остатках</li>
                      <li className="ind_4">обороты в валюте превышают 50% от оборотов в рублях</li>
                    </ol>
                  </div>
                </div>
                <FlatButton secondary={true} label="Применить" onClick={this._changePeriod} style={style.button} />
              </div>

            </div>

          </div>
          {this.props.children}
        </div>
      </BaseStore>
    )
  }
}

export default Relay.createContainer(BorrowersReport, {
  initialVariables: {
    search : '<',
    group: '1'          //this.props.location.query.group
  },
  fragments: {
    analytics: (variables) => Relay.QL`
      fragment on Analytics {
        borrowersTypeahead (search: $search, group: $group) {
          results
        },
      }
    `,
  }
});
