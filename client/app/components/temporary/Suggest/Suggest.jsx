import React, { Component } from 'react';
import { TextField, Styles } from 'material-ui';
//let { Colors } = Styles;
//import 'styles/fonts.styl';
import './Suggest.styl';

class Suggest extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      elementNum : document.getElementsByClassName('suggestList').length + 1,
      display : '',
      value: this.props.value||'',
      selected: -1,
    };
  }

  static defaultProps = {  };

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  _selectSuggest = (el, idx) => {
	  this.setState({
		  display : ' hidden',
		  value : el
	  });

	  this.props.onChange(el);
	  return false;
  };

  _keyDown = (e) => {
    this.setState({ display: '' });
    if( 'ArrowDown' === e.key){
      let idx = this.state.selected;
      if( idx < this.props.listIems.length-1) this.setState({ selected : ++idx });
      this.setState({value: this.props.listIems[idx]});
      return;
    }

    if( 'ArrowUp' === e.key){
      let idx = this.state.selected;
      if( idx > 0) this.setState({ selected : --idx });
      this.setState({value: this.props.listIems[idx]});
      return;
    }

    if (e.key === 'Esc' || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab') {
	   // this.props.loadSuggest( 0 );
	    this.setState({display: ' hidden'});
      return;
    }

    if (e.key === 'Enter') {
	    this._selectSuggest(e.target.value);
      return;
    }
    this.setState({ selected : -1 });
  };


  _change = (e)=> {
    this.setState({value:e.target.value});
    this.props.loadSuggest( e.target.value );
  };

  _blur = (e)=> {
    this.props.loadSuggest( 0 );
    this.setState({display: ' hidden'});
  };

  render() {

    let sugsestList;
    let suggestClass = 'suggestList '+ 'num-'+this.state.elementNum + this.state.display;


    if(!this.props.listIems.length){
      sugsestList = '';
    } else {
      sugsestList = this.props.listIems.map((el, idx)=>{
        return (
	        <li className={this.state.selected==idx?'selected':''} onClick={ (e)=>{ this._selectSuggest(el, idx);  } }> {el} </li>
        );
      });
      sugsestList = (
        <ul className={suggestClass}>
          {sugsestList}
        </ul>
      );
    }

// onFocus={this._focus}
// onKeyPress={this._inputKeyDown}

    return (
      <span className="suggest_box" style={ this.props.style }>
        <TextField onChange={this._change} value={this.state.value}  onBlur={()=>{setTimeout(()=>{this._blur});}} onKeyDown={this._keyDown} hintText="Поиск по клиенту" className="search-input" />
          {sugsestList}
      </span>
    );
  }
}

export default Suggest;
