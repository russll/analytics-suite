import React, { Component } from 'react';
import Utils from '../../../lib/Utils';

let u = new Utils();

class GridLine extends Component {

  constructor() {
    super();
//        this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler = () => {
    let nest = false;
    if (1 == this.props.data.nesting) {
      nest = true;
    }
    this.props.expandHandler( this.props.data, nest, this.props.clickHandler );
  };

  _showChart=()=>{
    let nest = false;
    this.props.chartHandler( this.props.data, nest );
  };

  render() {
    var _this = this,
      type,
      headClass = '',
      stickHeader = '',
      chartIcon = this.props.opts.showDialog ? (<span><i className="material-icons" onClick={this._showChart}>insert_chart</i></span>) : '';


    switch (this.props.data.type) {           // one type per line..
      case '%':
        type = '%';
        break;
      case 'RUR':
        type = '₽';
        break;
      case 'USD':
        type = '$';
        break;
      case 'EUR':
        type = '€';
        break;
      default:
        type = '';
    }

    if (this.props.data.header) headClass = 'heading';
    if (this.props.data.header && this.props.data.id==0) {headClass = 'heading tab-header'; stickHeader}
    if (this.props.data.val.name == 'ИТОГО финансовый результат' || this.props.data.val.name =='ИТОГО финансовый результат (управленческий)') headClass = 'heading bold';
    if (2 == this.props.data.nesting) headClass = 'data';
    if (1 == this.props.data.nesting) headClass = 'total';

    return (
      <tr ref={stickHeader} className={headClass} >
        {Object.keys(this.props.data.val).map((value) =>{
          let line = _this.props.data.val, className = '';

          if ('name' == value) className = 'title';
          if (!isNaN(Number(line[value]))) className = 'num';
          if (_this.props.data.header) {
            return <th className={className}>{u.dc(line[value],1)}</th>
          } else {

            if (_this.props.collapsed && 'title' == className && 1 == _this.props.data.nesting) {
              return <td className={className} data-tip={line[value]}>
                        <i onClick={this._clickHandler} className="material-icons">remove</i>{chartIcon}{line[value]}
                     </td>

            } else if (!_this.props.collapsed && 'title' == className && 1 == _this.props.data.nesting) {
              return <td className={className} data-tip={line[value]}><i onClick={this._clickHandler} className="material-icons">add</i>
                        {chartIcon}{line[value]}
                     </td>

              //ForBold in Rev Exp its Fhell
              } else if (!_this.props.collapsed && 'title' == className && 1 == _this.props.data.nesting && this.props.moduleName == "RevenuesExpenses" && line.name == 'ИТОГО финансовый результат') {
              return <td className={className} style={{fontWeight:"bold"}} data-tip={line[value]}><i onClick={this._clickHandler} className="material-icons">add</i>
                {chartIcon}{line[value]}
              </td>

            } else if('title' == className){
              return <td className={className}>{chartIcon}{u.dm(line[value], 0, '.', ' ', type) }</td>

            //for Revenues-Expenses
            } else if ( this.props.moduleName == "RevenuesExpenses"){
              return <td className={className}>{u.dm(line[value].slice(0,-3)||0)}</td>
//              return <td className={className}>{u.dm(line[value])}</td>
            }else{
              return <td className={className}>{u.dm(line[value], 0, '.', ' ', type) }</td>
            }
          }
        })}
      </tr>
    );
  }
}

export default GridLine