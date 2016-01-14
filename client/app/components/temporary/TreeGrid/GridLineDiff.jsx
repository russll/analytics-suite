import React, { Component } from 'react';
import InOtherBanks from '../Money/InOtherBanks.jsx';
import Utils from '../../../lib/Utils.js';
var u = new Utils;

class GridLineDiff extends Component {

  constructor() {
    super();
    this.state = {
      date: ''
    }
  }

  _clickHandler = () => {
    let nest = false;
    if (1 == this.props.data.nesting) {
      nest = true;
    }
    this.props.expandHandler( this.props.data, nest, this.props.clickHandler );
//    this.props.onClick(this.props.data, nest);
  };

  /*
   @prams (Value, [ Nubers after dot, decimal delimiter, thousand separator, currency sign( any string )])
   usage: _decorateMoney(-123456789.12345, 2, '.', ',', 'р.'); => -123,456,789.12р.
   */
  _decorateMoney(n, c, d, t, v) {
    if (isNaN(Number(n))) return n;
    n = Number(n);
    if (!n || typeof n === 'string') return n;
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? "." : d,
      t = t == undefined ? "," : t,
      v = v || '',
      s = n < 0 ? "-" : "",
      i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
      j = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "") + v;
  }

  passPar = (value, row) => {
    this.props.callDate(value, row);
  };

  render() {


    var _this = this,
      className = 'lm-td',
      headClass = '';

    if (this.props.data.header) headClass = 'heading';
    if (2 == this.props.data.nesting) headClass = 'data';
    if (1 == this.props.data.nesting) headClass = 'total';

    function _ct(type) {
      switch (type) {
        case '%':
          type = '%';
          break;
        case 'RUR':
        case 'RUB':
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
      return type;
    }

    var o = this.props.data.val;

    //onClick={this.props.callDate(value, this.props.data.val.name, true)}


    return (
      <tr className={headClass+' money-table__header'} onClick={this._clickHandler}>

        {Object.keys(o).map((value, index) => {

          if (typeof o[value] === 'number') className = 'num'; // || typeof Number( o[value].value ) === 'number'
          if (this.props.data.header) {
//            console.log('O',o[value], o[value].split('-').length );
            if(o[value].split('-').length === 3){
              return <th className={className}>{ u.dsn(o[value]) }</th>
              } else {
              return <th className={className}>{o[value]}</th>
              }
          }

          if ('string' === typeof o[value]) {

            if (!this.props.collapsed && 1 == this.props.data.nesting) {
              return <td className="title"><i className="material-icons">add</i>{o[value]} </td>
            } else if (this.props.collapsed && 1 == this.props.data.nesting) {
              return <td className="title"><i className="material-icons">remove</i>{o[value]} </td>
            } else {
              return <td className="title"> {o[value]}</td>
            }

          } else {

            if (typeof o[value] === 'object' && this.props.data.nesting != 1) {
              return <td
                className={className}> {this._decorateMoney(o[value].value, 0, '.', ' ', ' ') }</td>

            } else if (typeof o[value] === 'object' && this.props.data.nesting == 1) {
              return <td
                className={className}> {this._decorateMoney(o[value].value, 0, '.', ' ', ' ') }
                <i className="material-icons" style={{position:"relative", top:'8px', color:'#CCC'}}
                      onClick={this.passPar.bind(this, value, o.name)}>more_horiz</i>
              </td>

            } else {
              return <td
                className={className}> {this._decorateMoney(o[value], 0, '.', ' ', '') }</td>
            }

          }

        })}
      </tr>
    );
  }
}

export default GridLineDiff